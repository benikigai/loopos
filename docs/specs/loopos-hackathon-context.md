# Context: LoopOS Hackathon Slice
**Last updated:** 2026-04-29
**Phase:** Spec approved
**Approved option:** A (strict master-spec §5.0–5.7 phasing) + critic mitigations layered in (T7 multiplayer GO/NO-GO at min 95, T10 Lightsprint smoke at min 145)
**Tasks:** 14 (Simple: 7, Moderate: 5, Complex: 2)
**Time budget:** 205min vs ~210min available before demo. T8/T10 are first cuts if slipping.

**Key risks:**
- ChatGPT MCP connector availability for Ben's account (Beat 5) — discoverable at T7 (min ~95)
- Reboot scaffold layout vs. master §2.3 expected (T1 pre-flight gate)
- T11 UI complexity slip (six React components in 30min)

**Critic verdict:** CONCERNS — 5 specific issues, all addressed:
1. Pre-flight scaffold verification before nuking repo → T1 sandbox phase
2. 8-method aggressive build → P0 (5 methods)/P1 (T8/T9) split
3. Multiplayer smoke at min 145 too late → T7 inserted at min ~95
4. Lightsprint untested until min 120+ → T10 inserted at min ~145
5. Zero buffer for dry run → T13 dedicated 15min for two timed runs

**Research:** N/A — master Google Doc `1ohwoaS4nVKKbSakQrGTq0GnEaOSH9vOkqGorxh0jzqg` (LOOPOS — Master Spec) is the research artifact. Three live-discovery items deferred to T1, T7, T10.

**Critical path (longest chain):** T1 → T2 → T4 → T5 → T6 → T11 → T12 → T13 → T14 (~165min). T3 runs parallel via loop-skin tmux. T8/T9/T10 are off-critical-path.

**Dependency DAG:**
```
T1 → T2, T3
T2 + T3 → T4
T4 → T5
T5 → T6, T8, T9
T6 → T7, T11
T9 → T10
T11 → T12
T7 + T10 + T11 + T12 → T13 → T14
```

**Sponsor load-bearing moments:**
- TokenRouter: T2 wrapper, Beat 2 cost ticker
- Runpod: T2 whisper helper, Beat 1 transcription
- Reboot: T1 scaffold, T5–T8 servicer methods, T11 UI inside Claude, Beat 5 multiplayer
- Lightsprint: T10 smoke, Beat 6 PR ship cameo

**YC RFS coverage:**
- #2 (AI-Native Service Co — Alströmer): pitch line "we are the property manager"
- #4 (Company Brain — Blomfield): T11 SkillArtifact JSON viewer (Beat 4)
- #15 (AI OS for Companies — Hu): closed-loop Beats 5+6 + cost ticker (Q&A bridge)
- #12 (Software for Agents — Epstein): Q&A only — no /agents/ endpoints built
