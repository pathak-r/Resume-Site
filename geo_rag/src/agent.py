"""
Agent Orchestration
LangChain agent using langgraph (compatible with langchain 1.x).
"""
import pandas as pd
from langgraph.prebuilt import create_react_agent
from langchain_core.tools import StructuredTool
from pydantic import BaseModel, Field
from typing import Optional

from src.llm import get_chat_llm, get_embeddings
from src.tools import (
    production_query_tool,
    anomaly_check_tool,
    calculate_recovery_factor,
    calculate_decline_rate,
    document_search_tool,
)

SYSTEM_PROMPT = """You are a Subsurface AI Assistant for the Volve oil field in the North Sea.
You help reservoir and production engineers analyze well data by combining:
1. Structured production data (oil rates, water cut, pressure, gas production)
2. Unstructured well documents (drilling reports, completion reports, final well reports)

You have access to tools for:
- Querying production data for any of the 7 Volve wells
- Detecting anomalies in production trends
- Calculating recovery factors and decline rates
- Searching well documentation (drilling reports, completion reports)

When answering questions:
- You are in a multi-turn chat: short follow-ups like "proceed", "use available data only", "same well", or "elaborate" refer to the previous user question—carry forward the well name, metric, or task from context and call tools as needed.
- Always specify which well(s) you're analyzing using canonical names
- When calling search_well_documents, ALWAYS pass well_name when the user named a well
- Cite specific data points and document source_file names from tool output
- Only use facts returned by tools — never invent rates, depths, or events
- If a question requires both production data AND document context, use both tools
- Flag any anomalies or concerning trends proactively
- Use subsurface engineering terminology appropriately
- When uncertain or tools return nothing, say so

Well name rules:
- Canonical wells: 15/9-F-1 C, 15/9-F-11 H, 15/9-F-12 H, 15/9-F-14 H,
  15/9-F-15 D, 15/9-F-4 AH, 15/9-F-5 AH
- Short forms: F-11 → 15/9-F-11 H; F-1 or F-1 C → 15/9-F-1 C (never F-11/F-12/F-14/F-15)
- Prefer exact ids like "15/9-F-14 H" or "F-14" in tool calls

The field produced from 2008 to 2016, with total production of ~63 million barrels.
The reservoir is in the Hugin Formation at approximately 2750-3120m depth.
"""


class ProductionQueryInput(BaseModel):
    well_name: str = Field(
        description="Well id, e.g. '15/9-F-11 H', 'F-11', or 'F-1' (F-1 means 15/9-F-1 C only)"
    )
    metric: Optional[str] = Field(default=None, description="Specific metric: BORE_OIL_VOL, BORE_WAT_VOL, WATER_CUT_PCT, AVG_WHP_P, GOR")
    start_date: Optional[str] = Field(default=None, description="Start date filter YYYY-MM-DD")
    end_date: Optional[str] = Field(default=None, description="End date filter YYYY-MM-DD")


class AnomalyCheckInput(BaseModel):
    well_name: Optional[str] = Field(default=None, description="Well name to check, or leave empty for all wells")


class RecoveryFactorInput(BaseModel):
    well_name: str = Field(description="Well name to calculate recovery for")
    ooip_sm3: Optional[float] = Field(default=None, description="Original Oil in Place in Sm3")


class DeclineRateInput(BaseModel):
    well_name: str = Field(description="Well name for decline analysis")
    period_months: int = Field(default=6, description="Number of months to analyze")


class DocumentSearchInput(BaseModel):
    query: str = Field(description="Natural language query to search well documents")
    well_name: Optional[str] = Field(
        default=None,
        description="Well to scope search to, e.g. '15/9-F-14 H' or 'F-14'. Strongly recommended.",
    )
    doc_type: Optional[str] = Field(
        default=None,
        description="Optional doc type filter: daily_drilling_report, completion_report, final_well_report",
    )


def create_agent(df: pd.DataFrame):
    """Create the langgraph react agent with all tools."""
    llm = get_chat_llm(temperature=0.0)
    embeddings = get_embeddings()

    tools = [
        StructuredTool.from_function(
            func=lambda well_name, metric=None, start_date=None, end_date=None:
                production_query_tool(df, well_name, metric, start_date, end_date),
            name="query_production_data",
            description="Query well production data. Use this for questions about oil/water/gas rates, "
                        "water cut, pressure, or production trends for specific wells. "
                        "Pass start_date/end_date for period-specific questions.",
            args_schema=ProductionQueryInput,
        ),
        StructuredTool.from_function(
            func=lambda well_name=None: anomaly_check_tool(df, well_name),
            name="check_anomalies",
            description="Detect anomalies in production data. Use this to find unusual patterns "
                        "in water cut, production drops, pressure changes, or GOR spikes.",
            args_schema=AnomalyCheckInput,
        ),
        StructuredTool.from_function(
            func=lambda well_name, ooip_sm3=None:
                calculate_recovery_factor(df, well_name, ooip_sm3),
            name="calculate_recovery_factor",
            description="Calculate cumulative production and recovery factor for a well.",
            args_schema=RecoveryFactorInput,
        ),
        StructuredTool.from_function(
            func=lambda well_name, period_months=6:
                calculate_decline_rate(df, well_name, period_months),
            name="calculate_decline_rate",
            description="Calculate production decline rate for a well over a specified period.",
            args_schema=DeclineRateInput,
        ),
        StructuredTool.from_function(
            func=lambda query, well_name=None, doc_type=None:
                document_search_tool(query, embeddings, well_name=well_name, doc_type=doc_type),
            name="search_well_documents",
            description="Search drilling reports, completion reports, and final well reports. "
                        "Use this for questions about drilling operations, well construction, "
                        "geological findings, formation data, or historical well events. "
                        "Always pass well_name when the question is about a specific well.",
            args_schema=DocumentSearchInput,
        ),
    ]

    agent = create_react_agent(llm, tools, prompt=SYSTEM_PROMPT)
    return agent
