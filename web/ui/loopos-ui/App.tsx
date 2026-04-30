import { type FC, useState, useMemo } from "react";
import { useUser, useOpsTicket } from "@api/loopos/v1/loopos_rbt_react";
import css from "./App.module.css";

const PROPERTY_DISPLAY_NAMES: Record<string, string> = {
  warm_taipei_2br: "Warm Taipei 2BR",
  ito_stream_house: "Ito Stream House",
  creekfront_cabin: "Creekfront Cabin",
  mtn_city_reno: "Mtn City Reno",
};

const SPONSOR_COLORS: Record<string, string> = {
  Reboot: "rebootBadge",
  TokenRouter: "tokenrouterBadge",
  Runpod: "runpodBadge",
  Lightsprint: "lightsprintBadge",
};

const SponsorBadge: FC<{ sponsor: string; tier?: string; model?: string }> = ({
  sponsor,
  tier,
  model,
}) => {
  if (!sponsor) return null;
  const cls = SPONSOR_COLORS[sponsor] || "rebootBadge";
  const label = tier ? `${sponsor} · ${tier}` : sponsor;
  return (
    <span className={`${css.sponsorBadge} ${css[cls]}`}>
      {label}
      {model && <span className={css.sponsorModel}> · {model}</span>}
    </span>
  );
};

const TicketRow: FC<{
  ticketId: string;
  selected: boolean;
  onSelect: () => void;
}> = ({ ticketId, selected, onSelect }) => {
  const ticket = useOpsTicket({ id: ticketId });
  const { response } = ticket.useShowBrainSources();
  const property =
    PROPERTY_DISPLAY_NAMES[response?.propertyId ?? ""] ?? response?.propertyId ?? "—";
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

const ActivityFeedPanel: FC<{ ticketId: string }> = ({ ticketId }) => {
  const ticket = useOpsTicket({ id: ticketId });
  const { response, isLoading } = ticket.useActivityFeed();

  if (isLoading && !response) return <div className={css.muted}>loading activity…</div>;
  if (!response || response.events.length === 0) {
    return <div className={css.muted}>no activity yet</div>;
  }

  return (
    <div className={css.activityFeed}>
      <div className={css.cardLabel}>activity feed</div>
      {response.events.map((ev, i) => {
        const time = ev.ts ? ev.ts.split("T")[1]?.slice(0, 8) ?? ev.ts : "";
        const tokens =
          ev.inputTokens || ev.outputTokens
            ? `${ev.inputTokens}/${ev.outputTokens} tok`
            : "";
        const usd = ev.usd > 0 ? `$${ev.usd.toFixed(4)}` : "";
        return (
          <div key={i} className={css.activityEvent}>
            <div className={css.activityHeader}>
              <span className={css.activityTime}>{time}</span>
              <SponsorBadge sponsor={ev.sponsor} tier={ev.tier} model={ev.model} />
              <span className={css.activityType}>{ev.type}</span>
            </div>
            <div className={css.activitySummary}>{ev.summary}</div>
            {(tokens || usd) && (
              <div className={css.activityCost}>
                {tokens && <span className={css.activityTokens}>{tokens}</span>}
                {usd && <span className={css.activityUsd}>{usd}</span>}
              </div>
            )}
          </div>
        );
      })}
    </div>
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
    <div className={css.section}>
      <div className={css.sectionHeader}>
        <span className={css.cardLabel}>brain sources</span>
        <SponsorBadge sponsor="Reboot" />
      </div>
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
    <div className={css.section}>
      <div className={css.sectionHeader}>
        <span className={css.cardLabel}>skill artifact</span>
        <span className={css.ycBadge}>YC #4 · executable skills file</span>
      </div>
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
  const [copied, setCopied] = useState(false);

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

  const onCopy = async () => {
    if (!proposed) return;
    try {
      await navigator.clipboard.writeText(proposed.lightsprintPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className={css.section}>
      <div className={css.sectionHeader}>
        <span className={css.cardLabel}>propose new rule</span>
        <SponsorBadge sponsor="Reboot" />
      </div>
      {!proposed ? (
        <button className={css.button} onClick={onPropose} disabled={pending}>
          {pending ? "proposing…" : "propose rule from this ticket"}
        </button>
      ) : (
        <>
          <div className={css.cardTitle}>{proposed.title}</div>
          <div className={css.cardBody}>{proposed.description}</div>
          <div className={css.proposeBanner}>
            <span className={css.cardLabel}>destination: Lightsprint</span>
            <span className={css.muted}>
              paste this prompt into Lightsprint sandbox to ship a PR against benikigai/loopos
            </span>
          </div>
          <pre className={css.skillJson}>{proposed.lightsprintPrompt}</pre>
          <button className={css.button} onClick={onCopy}>
            {copied ? "copied ✓" : "copy prompt"}
          </button>
        </>
      )}
    </div>
  );
};

const CostTicker: FC = () => {
  const user = useUser();
  const { response, isLoading } = user.useCostSummary();

  if (isLoading && !response) {
    return (
      <div className={css.section}>
        <div className={css.sectionHeader}>
          <span className={css.cardLabel}>per-property cost</span>
          <SponsorBadge sponsor="TokenRouter" />
        </div>
        <div className={css.muted}>loading…</div>
      </div>
    );
  }

  const properties = response?.properties ?? [];

  if (properties.length === 0) {
    return (
      <div className={css.section}>
        <div className={css.sectionHeader}>
          <span className={css.cardLabel}>per-property cost</span>
          <SponsorBadge sponsor="TokenRouter" />
        </div>
        <div className={css.muted}>no calls yet today — ingest a ticket to start the meter</div>
      </div>
    );
  }

  return (
    <div className={css.section}>
      <div className={css.sectionHeader}>
        <span className={css.cardLabel}>per-property cost · today</span>
        <SponsorBadge sponsor="TokenRouter" />
      </div>
      <div className={css.tickerGrid}>
        {properties.map((p) => (
          <div key={p.propertyId} className={css.tickerCard}>
            <div className={css.tickerProperty}>{p.displayName || p.propertyId}</div>
            <div className={css.tickerLine}>
              today
              <span className={css.tickerNumber}>${p.todayUsd.toFixed(4)}</span>
            </div>
            <div className={css.tickerLine}>
              budget remaining
              <span className={css.tickerNumber}>${p.budgetRemainingUsd.toFixed(2)}</span>
            </div>
            <div className={css.tickerSplit}>
              <div>
                <div className={css.cardLabel}>fast</div>
                <div className={css.tickerSubLine}>
                  ${p.fastUsd.toFixed(4)} ({p.fastCalls})
                </div>
              </div>
              <div>
                <div className={css.cardLabel}>strong</div>
                <div className={css.tickerSubLine}>
                  ${p.strongUsd.toFixed(4)} ({p.strongCalls})
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {response && (
        <div className={css.fleetTotal}>
          <span className={css.cardLabel}>fleet today</span>
          <span>{response.totalCalls} calls</span>
          <span className={css.tickerNumber}>${response.totalTodayUsd.toFixed(4)}</span>
        </div>
      )}
    </div>
  );
};

export const LoopOsApp: FC = () => {
  const user = useUser();
  const { response: listResp } = user.useListTickets();
  const ticketIds = listResp?.tickets?.map((t) => t.ticketId) ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const effectiveSelected = selectedId ?? ticketIds[ticketIds.length - 1] ?? null;

  return (
    <div className={css.container}>
      <header className={css.header}>
        <span className={css.brand}>LoopOS</span>
      </header>

      {/* Pitch banner */}
      <section className={css.aboutSection}>
        <div className={css.aboutLead}>
          We replaced the back office with an agent.
          <br />
          <span className={css.aboutLeadAccent}>Powered by a Company Brain.</span>
        </div>
        <div className={css.aboutPillarRow}>
          <div className={css.aboutPillar}>
            <span className={css.ycBadge}>YC #2 · Alströmer</span>
            <div className={css.aboutPillarText}>
              <strong>"Sell the service, not the software."</strong>
              <br />
              Alströmer named insurance, accounting, compliance, healthcare.
              STR ops is the same shape. We replaced the back office with
              an agent. We take the margin.
            </div>
          </div>
          <div className={css.aboutPillar}>
            <span className={css.ycBadge}>YC #4 · Blomfield</span>
            <div className={css.aboutPillarText}>
              <strong>"Tribal knowledge in heads, email, Slack, tickets.
              Agents can't work that way."</strong>
              <br />
              Blomfield wants a living map. An executable skills file. We
              built one — four layers, one JSON. The agent runs against it.
              Not search. Not RAG.
            </div>
          </div>
          <div className={css.aboutPillar}>
            <SponsorBadge sponsor="TokenRouter" />
            <div className={css.aboutPillarText}>
              <strong>Per-property cost telemetry.</strong>
              <br />
              Every LLM call tagged. Every $ costed in real time. Margin per
              property, not per month.
            </div>
          </div>
        </div>
        <div className={css.aboutPitch}>
          We don't sell PMS software. We ARE the property manager.
        </div>
      </section>

      {/* ticket strip — horizontal on narrow viewports */}
      <section className={css.section}>
        <div className={css.sectionHeader}>
          <span className={css.cardLabel}>tickets ({ticketIds.length})</span>
          <SponsorBadge sponsor="Reboot" />
        </div>
        {ticketIds.length === 0 ? (
          <div className={css.muted}>no tickets — call ingest_text_message</div>
        ) : (
          <div className={css.ticketStrip}>
            {ticketIds.map((tid) => (
              <TicketRow
                key={tid}
                ticketId={tid}
                selected={tid === effectiveSelected}
                onSelect={() => setSelectedId(tid)}
              />
            ))}
          </div>
        )}
      </section>

      {effectiveSelected ? (
        <>
          {/* activity feed — the architecture firing in real time */}
          <section className={css.section}>
            <div className={css.sectionHeader}>
              <span className={css.cardLabel}>architecture trace</span>
              <span className={css.muted}>tools/sponsors/cost per step</span>
            </div>
            <ActivityFeedPanel ticketId={effectiveSelected} />
          </section>

          <BrainSourcesPanel ticketId={effectiveSelected} />
          <SkillArtifactViewer ticketId={effectiveSelected} />
          <ProposeRuleCard ticketId={effectiveSelected} />
        </>
      ) : (
        <div className={css.muted}>
          every company is an open loop. LoopOS closes the loop.
        </div>
      )}

      <CostTicker />
    </div>
  );
};
