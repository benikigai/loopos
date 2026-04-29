import { type FC } from "react";
import { useUser } from "@api/loopos/v1/loopos_rbt_react";
import css from "./App.module.css";

// T1 placeholder. T11 replaces this with three-pane TicketList / ChatPane / CostTicker.
export const LoopOsApp: FC = () => {
  const user = useUser();
  const { response, isLoading } = user.useListTickets();

  if (isLoading && response === undefined) {
    return (
      <div className={css.container}>
        <div className={css.loading}>loading…</div>
      </div>
    );
  }

  const ticketCount = response?.tickets?.length ?? 0;

  return (
    <div className={css.container}>
      <header className={css.header}>
        <span className={css.brand}>LoopOS</span>
        <span className={css.tag}>boot skeleton — T11 builds three-pane UI</span>
      </header>
      <section className={css.panel}>
        <div className={css.label}>tickets</div>
        <div className={css.value}>{ticketCount}</div>
        <div className={css.hint}>
          ingest_text_message via MCP to create a ticket.
        </div>
      </section>
    </div>
  );
};
