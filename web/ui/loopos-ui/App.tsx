import { type FC, useState, useMemo } from "react";
import { useUser, useOpsTicket } from "@api/loopos/v1/loopos_rbt_react";
import css from "./App.module.css";

const PROPERTY_DISPLAY_NAMES: Record<string, string> = {
  warm_taipei_2br: "Warm Taipei 2BR",
  ito_stream_house: "Ito Stream House",
  creekfront_cabin: "Creekfront Cabin",
  mtn_city_reno: "Mtn City Reno",
};

// Cost ticker numbers locked to gdrive demo arc (Warm Taipei 2BR · today $0.043
// · budget remaining $499.96). Real ticker tails usage.jsonl; static here for
// stage reliability — see master spec §9 fallback row 3.
const COST_DEMO = {
  property: "Warm Taipei 2BR",
  today_usd: 0.043,
  budget_remaining_usd: 499.96,
  fast_calls: 8,
  fast_usd: 0.004,
  strong_calls: 3,
  strong_usd: 0.039,
};

const TicketRow: FC<{
  ticketId: string;
  selected: boolean;
  onSelect: () => void;
}> = ({ ticketId, selected, onSelect }) => {
  const ticket = useOpsTicket({ id: ticketId });
  const { response } = ticket.useShowBrainSources();
  const property =
    PROPERTY_DISPLAY_NAMES[response?.property_id ?? ""] ?? response?.property_id ?? "—";
  return (
    <button
      className={`${css.ticketRow} ${selected ? css.ticketRowSelected : ""}`}
      onClick={onSelect}
    >
      <div className={css.ticketRowTop}>
        <span className={css.ticketProperty}>{property}</span>
        <span
          className={`${css.severityPill} ${
            response?.severity && response.severity >= 4 ? css.severityHigh : ""
          }`}
        >
          sev {response?.severity ?? "-"}
        </span>
      </div>
      <div className={css.ticketRowBottom}>
        <span className={css.ticketCategory}>{response?.category ?? "—"}</span>
        <span className={css.ticketStatus}>{response?.status ?? "NEW"}</span>
      </div>
    </button>
  );
};

const BrainSourcesPanel: FC<{ ticketId: string }> = ({ ticketId }) => {
  const ticket = useOpsTicket({ id: ticketId });
  const { response, isLoading } = ticket.useShowBrainSources();

  if (isLoading && !response) return <div className={css.muted}>loading brain…</div>;
  if (!response) return null;

  const cards: { label: string; title: string; body: string; meta?: string }[] = [];
  if (response.voiceMemo) {
    cards.push({
      label: "founder voice",
      title: response.voiceMemo.context || response.voiceMemo.id,
      body: response.voiceMemo.text,
      meta: response.voiceMemo.date,
    });
  }
  if (response.sop) {
    cards.push({
      label: "sop matched",
      title: response.sop.title,
      body: response.sop.snippet,
    });
  }
  if (response.historical) {
    cards.push({
      label: "historical resolution",
      title: response.historical.title,
      body: response.historical.snippet,
    });
  }
  if (cards.length === 0) {
    return <div className={css.muted}>no brain match yet — run triage first</div>;
  }

  return (
    <div className={css.brainCards}>
      {cards.map((c, i) => (
        <div key={i} className={css.brainCard}>
          <div className={css.cardLabel}>{c.label}</div>
          <div className={css.cardTitle}>{c.title}</div>
          <div className={css.cardBody}>{c.body}</div>
          {c.meta && <div className={css.cardMeta}>{c.meta}</div>}
        </div>
      ))}
    </div>
  );
};

const SkillArtifactViewer: FC<{ ticketId: string }> = ({ ticketId }) => {
  const ticket = useOpsTicket({ id: ticketId });
  const { response } = ticket.useShowBrainSources();

  const json = useMemo(() => {
    if (!response?.skillArtifact) return null;
    const a = response.skillArtifact;
    return {
      skill_id: a.skillId,
      name: a.name,
      description: a.description,
      trigger_conditions: a.triggerConditions,
      preferred_vendors: a.preferredVendors,
      auth_cap_usd: a.authCapUsd,
      guest_voice_style: a.guestVoiceStyle,
      approval_rules: a.approvalRules,
      sources: a.sources
        ? {
            derived_from_ticket: a.sources.derivedFromTicket,
            brain_layers_used: a.sources.brainLayersUsed,
            generated_by: a.sources.generatedBy,
            generated_at: a.sources.generatedAt,
          }
        : null,
    };
  }, [response]);

  if (!json) return null;

  return (
    <div className={css.skillBlock}>
      <div className={css.cardLabel}>skill artifact</div>
      <pre className={css.skillJson}>{JSON.stringify(json, null, 2)}</pre>
    </div>
  );
};

const ProposeRuleCard: FC<{ ticketId: string }> = ({ ticketId }) => {
  const ticket = useOpsTicket({ id: ticketId });
  const [proposed, setProposed] = useState<null | {
    title: string;
    description: string;
    lightsprintPrompt: string;
  }>(null);
  const [pending, setPending] = useState(false);

  const onPropose = async () => {
    setPending(true);
    try {
      const result = await ticket.proposeNewRule();
      if ("response" in result && result.response) {
        setProposed({
          title: result.response.title,
          description: result.response.description,
          lightsprintPrompt: result.response.lightsprintPrompt,
        });
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <div className={css.skillBlock}>
      <div className={css.cardLabel}>propose new rule</div>
      {!proposed ? (
        <button
          className={css.button}
          onClick={onPropose}
          disabled={pending}
        >
          {pending ? "proposing…" : "propose rule from this ticket"}
        </button>
      ) : (
        <>
          <div className={css.cardTitle}>{proposed.title}</div>
          <div className={css.cardBody}>{proposed.description}</div>
          <div className={css.cardLabel}>lightsprint prompt</div>
          <pre className={css.skillJson}>{proposed.lightsprintPrompt}</pre>
        </>
      )}
    </div>
  );
};

const CostTicker: FC = () => {
  return (
    <div className={css.tickerCard}>
      <div className={css.cardLabel}>per-property cost</div>
      <div className={css.tickerProperty}>{COST_DEMO.property}</div>
      <div className={css.tickerLine}>
        today <span className={css.tickerNumber}>${COST_DEMO.today_usd.toFixed(3)}</span>
      </div>
      <div className={css.tickerLine}>
        budget remaining{" "}
        <span className={css.tickerNumber}>${COST_DEMO.budget_remaining_usd.toFixed(2)}</span>
      </div>
      <div className={css.tickerSplit}>
        <div>
          <div className={css.cardLabel}>fast tier</div>
          <div className={css.tickerSubLine}>
            ${COST_DEMO.fast_usd.toFixed(3)} ({COST_DEMO.fast_calls} calls)
          </div>
        </div>
        <div>
          <div className={css.cardLabel}>strong tier</div>
          <div className={css.tickerSubLine}>
            ${COST_DEMO.strong_usd.toFixed(3)} ({COST_DEMO.strong_calls} calls)
          </div>
        </div>
      </div>
    </div>
  );
};

export const LoopOsApp: FC = () => {
  const user = useUser();
  const { response: listResp } = user.useListTickets();
  const ticketIds = listResp?.tickets?.map((t) => t.ticketId) ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Auto-select the latest ticket if none selected.
  const effectiveSelected = selectedId ?? ticketIds[ticketIds.length - 1] ?? null;

  return (
    <div className={css.container}>
      <header className={css.header}>
        <span className={css.brand}>LoopOS</span>
        <span className={css.tag}>company brain · ops execution</span>
      </header>
      <div className={css.threePane}>
        <aside className={css.leftPane}>
          <div className={css.cardLabel}>tickets</div>
          {ticketIds.length === 0 ? (
            <div className={css.muted}>
              no tickets yet — call ingest_text_message
            </div>
          ) : (
            ticketIds.map((tid) => (
              <TicketRow
                key={tid}
                ticketId={tid}
                selected={tid === effectiveSelected}
                onSelect={() => setSelectedId(tid)}
              />
            ))
          )}
        </aside>
        <main className={css.centerPane}>
          {effectiveSelected ? (
            <>
              <BrainSourcesPanel ticketId={effectiveSelected} />
              <SkillArtifactViewer ticketId={effectiveSelected} />
              <ProposeRuleCard ticketId={effectiveSelected} />
            </>
          ) : (
            <div className={css.muted}>
              every company is an open loop. LoopOS closes the loop.
            </div>
          )}
        </main>
        <aside className={css.rightPane}>
          <CostTicker />
        </aside>
      </div>
    </div>
  );
};
