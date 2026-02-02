const EventList = ({ seriesTicker, onBack, onSelectMarket }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedEvent, setExpandedEvent] = useState(null);
    const [markets, setMarkets] = useState({});

    useEffect(() => {
        setLoading(true);
        fetch(`/api/series/${seriesTicker}/events`)
            .then(res => res.json())
            .then(data => {
                setEvents(data);
                setLoading(false);
            })
            .catch(e => setLoading(false));
    }, [seriesTicker]);

    const handleExpand = async (event) => {
        if (expandedEvent === event.event_ticker) {
            setExpandedEvent(null);
            return;
        }

        setExpandedEvent(event.event_ticker);
        if (!markets[event.event_ticker]) {
            try {
                const res = await fetch(`/api/events/${event.event_ticker}/markets`);
                const data = await res.json();
                data.sort((a, b) => (b.volume_24h || 0) - (a.volume_24h || 0));
                setMarkets(prev => ({ ...prev, [event.event_ticker]: data }));
            } catch (e) {
                console.error(e);
            }
        }
    };

    if (loading) return <div className="p-8 text-zinc-500">Loading Events...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <button onClick={onBack} className="mb-6 text-zinc-500 hover:text-white flex items-center gap-2">
                &larr; Back to Search
            </button>
            <h1 className="text-3xl font-bold text-white mb-2">{seriesTicker} Events</h1>
            <p className="text-zinc-500 mb-8">Select an event to view markets</p>

            <div className="flex flex-col gap-3">
                {events.map(e => (
                    <div key={e.event_ticker} className="bg-[#18181b] border border-zinc-800 rounded-xl overflow-hidden">
                        <button
                            onClick={() => handleExpand(e)}
                            className="w-full text-left p-4 hover:bg-[#202023] flex justify-between items-center transition-colors"
                        >
                            <div>
                                <div className="text-white font-medium">{e.title}</div>
                                <div className="text-xs text-zinc-500 mt-1">{e.sub_title}</div>
                            </div>
                            <div className="text-zinc-600">
                                {expandedEvent === e.event_ticker ? '▲' : '▼'}
                            </div>
                        </button>

                        {expandedEvent === e.event_ticker && (
                            <div className="bg-[#111113] border-t border-zinc-800 p-4">
                                {markets[e.event_ticker] ? (
                                    <div className="grid gap-2">
                                        {markets[e.event_ticker].map(m => (
                                            <button
                                                key={m.ticker}
                                                onClick={() => onSelectMarket(m.ticker)}
                                                className={`flex justify-between items-center p-3 rounded bg-[#18181b] hover:bg-zinc-800 border transition-all text-left ${getStatusColor(m.status)}`}
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-zinc-300 font-bold">{m.yes_sub_title || m.title}</span>
                                                        {m.subtitle && <span className="text-[10px] text-zinc-500 bg-zinc-800 px-1 rounded">{m.subtitle.replace(':: ', '')}</span>}
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase ${getStatusColor(m.status)}`}>{m.status}</span>
                                                    </div>
                                                    <div className="text-xs text-zinc-500 font-mono mt-0.5">Vol: {formatNumber(m.volume_24h)}</div>
                                                </div>
                                                <div className="flex gap-4 text-sm font-mono">
                                                    <div className="text-right">
                                                        <div className="text-[10px] text-zinc-600 uppercase">Yes</div>
                                                        <div className="text-green-400">{formatPrice(m.yes_ask)}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-[10px] text-zinc-600 uppercase">No</div>
                                                        <div className="text-red-400">{formatPrice(m.no_ask)}</div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-zinc-600 text-sm animate-pulse">Loading markets...</div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
