import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const DAYS = ["Sep 4", "Sep 5", "Sep 6", "Sep 7", "Sep 8", "Sep 9", "Sep 10"];

const REVENUE = [9.8, 11.2, 10.4, 12.9, 13.6, 12.1, 14.3].map((v, i) => ({ day: DAYS[i], value: v }));
const SESSIONS = [3120, 3450, 3310, 3980, 4210, 4050, 4470].map((v, i) => ({ day: DAYS[i], value: v }));
const SIGNUPS = [410, 468, 442, 520, 561, 534, 604].map((v, i) => ({ day: DAYS[i], value: v }));
const DURATION = [18.2, 17.6, 19.1, 19.8, 20.4, 19.9, 21.2].map((v, i) => ({ day: DAYS[i], value: v }));

const PURPLE = "#6B46C1";
const LILAC = "#B79AEF";

const axisStyle = { fontSize: 10, fill: "#6b6478" };
const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid #e7e2f2",
  boxShadow: "0 6px 20px rgba(43,27,84,.10)",
  fontSize: 12,
} as const;

function ChartCard({
  title,
  value,
  delta,
  children,
}: {
  title: string;
  value: string;
  delta: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{title}</p>
          <p className="mt-1 text-xl font-semibold tracking-tight text-foreground">{value}</p>
        </div>
        <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11px] font-bold text-emerald-700">{delta}</span>
      </div>
      <div className="mt-3 h-32">{children}</div>
    </div>
  );
}

export function AnalyticsOverview() {
  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-sm font-bold tracking-tight text-foreground">Analytics overview</h2>
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Last 7 days · mock data</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title="Daily gross revenue" value="$14.3K today" delta="+9.4%">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={REVENUE} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={PURPLE} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={PURPLE} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eeeaf7" vertical={false} />
              <XAxis dataKey="day" tick={axisStyle} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis tick={axisStyle} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}K`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`$${v}K`, "Revenue"]} />
              <Area type="monotone" dataKey="value" stroke={PURPLE} strokeWidth={2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Total active sessions" value="4,470 today" delta="+6.1%">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SESSIONS} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eeeaf7" vertical={false} />
              <XAxis dataKey="day" tick={axisStyle} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v.toLocaleString(), "Sessions"]} />
              <Bar dataKey="value" fill={PURPLE} radius={[3, 3, 0, 0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="New user signups" value="604 today" delta="+13.2%">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={SIGNUPS} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eeeaf7" vertical={false} />
              <XAxis dataKey="day" tick={axisStyle} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v, "Signups"]} />
              <Line type="monotone" dataKey="value" stroke={PURPLE} strokeWidth={2} dot={{ r: 2.5, fill: PURPLE }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Avg session duration" value="21.2 min" delta="+4.7%">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DURATION} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="dur" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={LILAC} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={LILAC} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eeeaf7" vertical={false} />
              <XAxis dataKey="day" tick={axisStyle} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis tick={axisStyle} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}m`} domain={["dataMin - 2", "dataMax + 1"]} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} min`, "Avg duration"]} />
              <Area type="monotone" dataKey="value" stroke={PURPLE} strokeWidth={2} fill="url(#dur)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </section>
  );
}
