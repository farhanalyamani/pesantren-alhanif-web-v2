import { kpiData } from '../data/mockData';

function KPICard({ data }) {
  const { label, value, unit, icon, iconClass, glowClass, valueColor, bottom } = data;

  return (
    <div className="kpi-card animate-fade-in">
      <div className={`kpi-card-glow ${glowClass}`} />

      <div className="kpi-card-top">
        <div>
          <div className="kpi-label">{label}</div>
          <div className="kpi-value-row">
            <span className={`kpi-value ${valueColor}`}>{value}</span>
            <span className="kpi-unit">{unit}</span>
          </div>
        </div>
        <div className={`kpi-icon ${iconClass}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>

      <div className="kpi-card-bottom">
        {bottom.type === 'bar' && (
          <>
            <div className="kpi-bar-container">
              <div className="kpi-bar-labels">
                <span>{bottom.leftLabel}</span>
                <span>{bottom.rightLabel}</span>
              </div>
              <div className="kpi-bar">
                {bottom.segments.map((seg, i) => (
                  <div
                    key={i}
                    className="kpi-bar-fill"
                    style={{ width: seg.width, background: seg.color }}
                  />
                ))}
              </div>
            </div>
            {bottom.chip && (
              <div className="kpi-chip" style={bottom.chip.style}>
                <span className="material-symbols-outlined">{bottom.chip.icon}</span>
                <span>{bottom.chip.text}</span>
              </div>
            )}
          </>
        )}

        {bottom.type === 'meta' && (
          <>
            {bottom.rows.map((row, i) => (
              <div key={i} className="kpi-meta">
                <span>{row.label}</span>
                <span className={`kpi-meta-value ${row.valueColor || ''}`}>{row.value}</span>
              </div>
            ))}
            {bottom.trend && (
              <div className={`kpi-trend ${bottom.trend.color}`}>
                <span className="material-symbols-outlined">{bottom.trend.icon}</span>
                <span>{bottom.trend.text}</span>
              </div>
            )}
            {bottom.chip && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: bottom.chip.color, flexShrink: 0 }} />
                <span>{bottom.chip.text}</span>
              </div>
            )}
            {bottom.note && (
              <span style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                {bottom.note}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function KPIGrid() {
  return (
    <div className="kpi-grid">
      {kpiData.map((item) => (
        <KPICard key={item.id} data={item} />
      ))}
    </div>
  );
}
