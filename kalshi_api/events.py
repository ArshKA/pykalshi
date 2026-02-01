from __future__ import annotations
from typing import TYPE_CHECKING
from .models import EventModel, MarketModel

if TYPE_CHECKING:
    from .client import KalshiClient
    from .markets import Market


class Event:
    """
    Represents a Kalshi Event.
    
    An event is a container for related markets (e.g., "Will X happen?" with
    multiple outcome markets).
    """

    def __init__(self, client: KalshiClient, data: EventModel) -> None:
        self.client = client
        self.data = data
        self.event_ticker = data.event_ticker
        self.series_ticker = data.series_ticker
        self.title = data.title
        self.sub_title = data.sub_title
        self.category = data.category
        self.mutually_exclusive = data.mutually_exclusive

    def get_markets(self) -> list[Market]:
        """Get all markets for this event."""
        from .markets import Market
        
        return self.client.get_markets(event_ticker=self.event_ticker)

    def __repr__(self) -> str:
        return f"<Event {self.event_ticker}>"
