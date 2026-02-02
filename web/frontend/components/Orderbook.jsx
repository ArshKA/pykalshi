const Orderbook = ({ ticker }) => {
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!ticker) return;
        setLoading(true);
        fetch(`/api/markets/${ticker}/orderbook`)
            .then(res => res.json())
            .then(data => {
                setBook(data);
                setLoading(false);
            })
            .catch(e => setLoading(false));

        const interval = setInterval(() => {
            fetch(`/api/markets/${ticker}/orderbook`)
                .then(res => res.json())
                .then(data => setBook(data))
                .catch(e => { });
        }, 3000);

        return () => clearInterval(interval);
    }, [ticker]);

    if (loading && !book) return <div className="h-full flex items-center justify-center text-zinc-600 text-xs uppercase tracking-wide animate-pulse">Loading Depth...</div>;

    const yesLevels = book?.orderbook?.yes || [];
    const noLevels = book?.orderbook?.no || [];

    const topYesBids = [...yesLevels].sort((a, b) => b[0] - a[0]);
    const topNoBids = [...noLevels].sort((a, b) => b[0] - a[0]);

    return (
        <div className="flex flex-col h-full bg-[#111113] rounded-lg border border-zinc-800 overflow-hidden shadow-xl">
            <div className="px-4 py-3 border-b border-zinc-800 flex justify-between items-center bg-[#131316]">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Depth / Ladder</h3>
                <div className="flex gap-2">
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-kalshi-green"></span><span className="text-[10px] text-zinc-500">YES</span></div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-kalshi-red"></span><span className="text-[10px] text-zinc-500">NO</span></div>
                </div>
            </div>

            <div className="grid grid-cols-2 flex-1 overflow-hidden">
                <div className="border-r border-zinc-800 flex flex-col">
                    <div className="flex justify-between text-[10px] uppercase text-zinc-500 px-3 py-2 bg-zinc-900/50">
                        <span>Bid (Yes)</span>
                        <span>Qty</span>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                        {topYesBids.map(([price, qty], i) => (
                            <div key={i} className="flex justify-between items-center px-2 py-0.5 mb-px rounded cursor-pointer hover:bg-green-900/10 group">
                                <span className="font-mono text-green-400 text-sm">{price}¢</span>
                                <span className="font-mono text-zinc-400 text-xs group-hover:text-white">{formatNumber(qty)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="flex justify-between text-[10px] uppercase text-zinc-500 px-3 py-2 bg-zinc-900/50">
                        <span>Bid (No)</span>
                        <span>Qty</span>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                        {topNoBids.map(([price, qty], i) => (
                            <div key={i} className="flex justify-between items-center px-2 py-0.5 mb-px rounded cursor-pointer hover:bg-red-900/10 group">
                                <span className="font-mono text-red-400 text-sm">{price}¢</span>
                                <span className="font-mono text-zinc-400 text-xs group-hover:text-white">{formatNumber(qty)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
