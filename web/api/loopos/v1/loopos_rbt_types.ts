import { z } from "zod/v4";
import * as reboot_api from "@reboot-dev/reboot-api";

export const HistoryEventSchema = z.object({
    ts: z.string().default("").meta({ tag: 1 }),
    type: z.string().default("").meta({ tag: 2 }),
    payloadJson: z.string().default("").meta({ tag: 3 }),
  });

export type HistoryEvent = z.infer<typeof HistoryEventSchema>;

export const DispatchSchema = z.object({
    id: z.string().default("").meta({ tag: 1 }),
    vendorId: z.string().default("").meta({ tag: 2 }),
    costEstimateUsd: z.number().default(0).meta({ tag: 3 }),
    authorized: z.boolean().default(false).meta({ tag: 4 }),
    etaIso: z.string().default("").meta({ tag: 5 }),
    autoEscalateAfterSeconds: z.number().default(0).meta({ tag: 6 }),
    acknowledged: z.boolean().default(false).meta({ tag: 7 }),
    escalated: z.boolean().default(false).meta({ tag: 8 }),
  });

export type Dispatch = z.infer<typeof DispatchSchema>;

export const SkillSourcesSchema = z.object({
    derivedFromTicket: z.string().default("").meta({ tag: 1 }),
    brainLayersUsed: z.array(z.string()).default(reboot_api.EMPTY_ARRAY).meta({ tag: 2 }),
    generatedBy: z.string().default("").meta({ tag: 3 }),
    generatedAt: z.string().default("").meta({ tag: 4 }),
  });

export type SkillSources = z.infer<typeof SkillSourcesSchema>;

export const SkillArtifactSchema = z.object({
    skillId: z.string().default("").meta({ tag: 1 }),
    name: z.string().default("").meta({ tag: 2 }),
    description: z.string().default("").meta({ tag: 3 }),
    triggerConditions: z.array(z.string()).default(reboot_api.EMPTY_ARRAY).meta({ tag: 4 }),
    inputsRequired: z.array(z.string()).default(reboot_api.EMPTY_ARRAY).meta({ tag: 5 }),
    workflowSteps: z.array(z.string()).default(reboot_api.EMPTY_ARRAY).meta({ tag: 6 }),
    preferredVendors: z.array(z.string()).default(reboot_api.EMPTY_ARRAY).meta({ tag: 7 }),
    authCapUsd: z.number().default(0).meta({ tag: 8 }),
    guestVoiceStyle: z.string().default("").meta({ tag: 9 }),
    approvalRules: z.array(z.string()).default(reboot_api.EMPTY_ARRAY).meta({ tag: 10 }),
    sources: z.object({
    derivedFromTicket: z.string().default("").meta({ tag: 1 }),
    brainLayersUsed: z.array(z.string()).default(reboot_api.EMPTY_ARRAY).meta({ tag: 2 }),
    generatedBy: z.string().default("").meta({ tag: 3 }),
    generatedAt: z.string().default("").meta({ tag: 4 }),
  }).optional().default(undefined).meta({ tag: 11 }),
  });

export type SkillArtifact = z.infer<typeof SkillArtifactSchema>;

export const TicketSummarySchema = z.object({
    ticketId: z.string().default("").meta({ tag: 1 }),
    propertyId: z.string().default("").meta({ tag: 2 }),
    status: z.string().default("").meta({ tag: 3 }),
    severity: z.number().default(0).meta({ tag: 4 }),
    category: z.string().default("").meta({ tag: 5 }),
    lastAction: z.string().default("").meta({ tag: 6 }),
    costAuthorizedUsd: z.number().default(0).meta({ tag: 7 }),
    snippet: z.string().default("").meta({ tag: 8 }),
  });

export type TicketSummary = z.infer<typeof TicketSummarySchema>;

export const BrainVoiceMemoSchema = z.object({
    id: z.string().default("").meta({ tag: 1 }),
    text: z.string().default("").meta({ tag: 2 }),
    context: z.string().default("").meta({ tag: 3 }),
    date: z.string().default("").meta({ tag: 4 }),
    relevance: z.number().default(0).meta({ tag: 5 }),
  });

export type BrainVoiceMemo = z.infer<typeof BrainVoiceMemoSchema>;

export const BrainSOPSchema = z.object({
    id: z.string().default("").meta({ tag: 1 }),
    title: z.string().default("").meta({ tag: 2 }),
    snippet: z.string().default("").meta({ tag: 3 }),
  });

export type BrainSOP = z.infer<typeof BrainSOPSchema>;

export const BrainHistoricalSchema = z.object({
    ticketId: z.string().default("").meta({ tag: 1 }),
    title: z.string().default("").meta({ tag: 2 }),
    snippet: z.string().default("").meta({ tag: 3 }),
    relevance: z.number().default(0).meta({ tag: 4 }),
  });

export type BrainHistorical = z.infer<typeof BrainHistoricalSchema>;

export const IngestTextRequestSchema = z.object({
    propertyId: z.string().meta({ tag: 1 }),
    text: z.string().meta({ tag: 2 }),
    senderUserId: z.string().default("").meta({ tag: 3 }),
  });

export type IngestTextRequest = z.infer<typeof IngestTextRequestSchema>;

export const IngestVoiceRequestSchema = z.object({
    propertyId: z.string().meta({ tag: 1 }),
    audioUrl: z.string().meta({ tag: 2 }),
    senderUserId: z.string().default("").meta({ tag: 3 }),
  });

export type IngestVoiceRequest = z.infer<typeof IngestVoiceRequestSchema>;

export const IngestResponseSchema = z.object({
    ticketId: z.string().meta({ tag: 1 }),
  });

export type IngestResponse = z.infer<typeof IngestResponseSchema>;

export const CreateTicketRequestSchema = z.object({
    propertyId: z.string().default("").meta({ tag: 1 }),
    source: z.string().default("").meta({ tag: 2 }),
    rawInput: z.string().default("").meta({ tag: 3 }),
    transcriptNative: z.string().default("").meta({ tag: 4 }),
    transcriptEn: z.string().default("").meta({ tag: 5 }),
    detectedLanguage: z.string().default("").meta({ tag: 6 }),
    senderUserId: z.string().default("").meta({ tag: 7 }),
    createdAt: z.string().default("").meta({ tag: 8 }),
  });

export type CreateTicketRequest = z.infer<typeof CreateTicketRequestSchema>;

export const ListTicketsResponseSchema = z.object({
    tickets: z.array(z.object({
    ticketId: z.string().default("").meta({ tag: 1 }),
    propertyId: z.string().default("").meta({ tag: 2 }),
    status: z.string().default("").meta({ tag: 3 }),
    severity: z.number().default(0).meta({ tag: 4 }),
    category: z.string().default("").meta({ tag: 5 }),
    lastAction: z.string().default("").meta({ tag: 6 }),
    costAuthorizedUsd: z.number().default(0).meta({ tag: 7 }),
    snippet: z.string().default("").meta({ tag: 8 }),
  })).default(reboot_api.EMPTY_ARRAY).meta({ tag: 1 }),
  });

export type ListTicketsResponse = z.infer<typeof ListTicketsResponseSchema>;

export const QueryBrainRequestSchema = z.object({
    query: z.string().meta({ tag: 1 }),
    propertyId: z.string().default("").meta({ tag: 2 }),
  });

export type QueryBrainRequest = z.infer<typeof QueryBrainRequestSchema>;

export const QueryBrainResponseSchema = z.object({
    voiceMemos: z.array(z.object({
    id: z.string().default("").meta({ tag: 1 }),
    text: z.string().default("").meta({ tag: 2 }),
    context: z.string().default("").meta({ tag: 3 }),
    date: z.string().default("").meta({ tag: 4 }),
    relevance: z.number().default(0).meta({ tag: 5 }),
  })).default(reboot_api.EMPTY_ARRAY).meta({ tag: 1 }),
    sop: z.object({
    id: z.string().default("").meta({ tag: 1 }),
    title: z.string().default("").meta({ tag: 2 }),
    snippet: z.string().default("").meta({ tag: 3 }),
  }).optional().default(undefined).meta({ tag: 2 }),
    historical: z.array(z.object({
    ticketId: z.string().default("").meta({ tag: 1 }),
    title: z.string().default("").meta({ tag: 2 }),
    snippet: z.string().default("").meta({ tag: 3 }),
    relevance: z.number().default(0).meta({ tag: 4 }),
  })).default(reboot_api.EMPTY_ARRAY).meta({ tag: 3 }),
  });

export type QueryBrainResponse = z.infer<typeof QueryBrainResponseSchema>;

export const LiveStateResponseSchema = z.object({
    tickets: z.array(z.object({
    ticketId: z.string().default("").meta({ tag: 1 }),
    propertyId: z.string().default("").meta({ tag: 2 }),
    status: z.string().default("").meta({ tag: 3 }),
    severity: z.number().default(0).meta({ tag: 4 }),
    category: z.string().default("").meta({ tag: 5 }),
    lastAction: z.string().default("").meta({ tag: 6 }),
    costAuthorizedUsd: z.number().default(0).meta({ tag: 7 }),
    snippet: z.string().default("").meta({ tag: 8 }),
  })).default(reboot_api.EMPTY_ARRAY).meta({ tag: 1 }),
    recentEventJsons: z.array(z.string()).default(reboot_api.EMPTY_ARRAY).meta({ tag: 2 }),
  });

export type LiveStateResponse = z.infer<typeof LiveStateResponseSchema>;

export const ShowBrainSourcesResponseSchema = z.object({
    voiceMemo: z.object({
    id: z.string().default("").meta({ tag: 1 }),
    text: z.string().default("").meta({ tag: 2 }),
    context: z.string().default("").meta({ tag: 3 }),
    date: z.string().default("").meta({ tag: 4 }),
    relevance: z.number().default(0).meta({ tag: 5 }),
  }).optional().default(undefined).meta({ tag: 1 }),
    sop: z.object({
    id: z.string().default("").meta({ tag: 1 }),
    title: z.string().default("").meta({ tag: 2 }),
    snippet: z.string().default("").meta({ tag: 3 }),
  }).optional().default(undefined).meta({ tag: 2 }),
    historical: z.object({
    ticketId: z.string().default("").meta({ tag: 1 }),
    title: z.string().default("").meta({ tag: 2 }),
    snippet: z.string().default("").meta({ tag: 3 }),
    relevance: z.number().default(0).meta({ tag: 4 }),
  }).optional().default(undefined).meta({ tag: 3 }),
  });

export type ShowBrainSourcesResponse = z.infer<typeof ShowBrainSourcesResponseSchema>;

export const DispatchRequestSchema = z.object({
    vendorId: z.string().meta({ tag: 1 }),
    costEstimateUsd: z.number().meta({ tag: 2 }),
  });

export type DispatchRequest = z.infer<typeof DispatchRequestSchema>;

export const DispatchResponseSchema = z.object({
    dispatchId: z.string().meta({ tag: 1 }),
    status: z.string().meta({ tag: 2 }),
  });

export type DispatchResponse = z.infer<typeof DispatchResponseSchema>;

export const AcknowledgeDispatchRequestSchema = z.object({
    dispatchId: z.string().meta({ tag: 1 }),
  });

export type AcknowledgeDispatchRequest = z.infer<typeof AcknowledgeDispatchRequestSchema>;

export const ProposeNewRuleResponseSchema = z.object({
    ruleId: z.string().meta({ tag: 1 }),
    title: z.string().meta({ tag: 2 }),
    description: z.string().meta({ tag: 3 }),
    ruleJson: z.string().meta({ tag: 4 }),
    lightsprintPrompt: z.string().meta({ tag: 5 }),
  });

export type ProposeNewRuleResponse = z.infer<typeof ProposeNewRuleResponseSchema>;

export const UserStateSchema = z.object({
    ticketIds: z.array(z.string()).default(reboot_api.EMPTY_ARRAY).meta({ tag: 1 }),
  });

export type UserState = z.infer<typeof UserStateSchema>;

export const OpsTicketStateSchema = z.object({
    propertyId: z.string().default("").meta({ tag: 1 }),
    source: z.string().default("").meta({ tag: 2 }),
    rawInput: z.string().default("").meta({ tag: 3 }),
    transcriptNative: z.string().default("").meta({ tag: 4 }),
    transcriptEn: z.string().default("").meta({ tag: 5 }),
    detectedLanguage: z.string().default("").meta({ tag: 6 }),
    category: z.string().default("").meta({ tag: 7 }),
    severity: z.number().default(0).meta({ tag: 8 }),
    status: z.string().default("").meta({ tag: 9 }),
    assignedTo: z.string().default("").meta({ tag: 10 }),
    costAuthorizedUsd: z.number().default(0).meta({ tag: 11 }),
    matchedSopId: z.string().default("").meta({ tag: 12 }),
    matchedVoiceMemoIds: z.array(z.string()).default(reboot_api.EMPTY_ARRAY).meta({ tag: 13 }),
    matchedHistoricalIds: z.array(z.string()).default(reboot_api.EMPTY_ARRAY).meta({ tag: 14 }),
    skillArtifact: z.object({
    skillId: z.string().default("").meta({ tag: 1 }),
    name: z.string().default("").meta({ tag: 2 }),
    description: z.string().default("").meta({ tag: 3 }),
    triggerConditions: z.array(z.string()).default(reboot_api.EMPTY_ARRAY).meta({ tag: 4 }),
    inputsRequired: z.array(z.string()).default(reboot_api.EMPTY_ARRAY).meta({ tag: 5 }),
    workflowSteps: z.array(z.string()).default(reboot_api.EMPTY_ARRAY).meta({ tag: 6 }),
    preferredVendors: z.array(z.string()).default(reboot_api.EMPTY_ARRAY).meta({ tag: 7 }),
    authCapUsd: z.number().default(0).meta({ tag: 8 }),
    guestVoiceStyle: z.string().default("").meta({ tag: 9 }),
    approvalRules: z.array(z.string()).default(reboot_api.EMPTY_ARRAY).meta({ tag: 10 }),
    sources: z.object({
    derivedFromTicket: z.string().default("").meta({ tag: 1 }),
    brainLayersUsed: z.array(z.string()).default(reboot_api.EMPTY_ARRAY).meta({ tag: 2 }),
    generatedBy: z.string().default("").meta({ tag: 3 }),
    generatedAt: z.string().default("").meta({ tag: 4 }),
  }).optional().default(undefined).meta({ tag: 11 }),
  }).optional().default(undefined).meta({ tag: 15 }),
    createdAt: z.string().default("").meta({ tag: 16 }),
    senderUserId: z.string().default("").meta({ tag: 17 }),
    history: z.array(z.object({
    ts: z.string().default("").meta({ tag: 1 }),
    type: z.string().default("").meta({ tag: 2 }),
    payloadJson: z.string().default("").meta({ tag: 3 }),
  })).default(reboot_api.EMPTY_ARRAY).meta({ tag: 18 }),
    dispatches: z.array(z.object({
    id: z.string().default("").meta({ tag: 1 }),
    vendorId: z.string().default("").meta({ tag: 2 }),
    costEstimateUsd: z.number().default(0).meta({ tag: 3 }),
    authorized: z.boolean().default(false).meta({ tag: 4 }),
    etaIso: z.string().default("").meta({ tag: 5 }),
    autoEscalateAfterSeconds: z.number().default(0).meta({ tag: 6 }),
    acknowledged: z.boolean().default(false).meta({ tag: 7 }),
    escalated: z.boolean().default(false).meta({ tag: 8 }),
  })).default(reboot_api.EMPTY_ARRAY).meta({ tag: 19 }),
  });

export type OpsTicketState = z.infer<typeof OpsTicketStateSchema>;

export const UserListTicketsRequestSchema = z.object({});

export type UserListTicketsRequest = z.infer<typeof UserListTicketsRequestSchema>;

export const UserLiveStateRequestSchema = z.object({});

export type UserLiveStateRequest = z.infer<typeof UserLiveStateRequestSchema>;

export const UserCreateRequestSchema = z.object({});

export type UserCreateRequest = z.infer<typeof UserCreateRequestSchema>;

export const OpsTicketTriageRequestSchema = z.object({});

export type OpsTicketTriageRequest = z.infer<typeof OpsTicketTriageRequestSchema>;

export const OpsTicketProposeNewRuleRequestSchema = z.object({});

export type OpsTicketProposeNewRuleRequest = z.infer<typeof OpsTicketProposeNewRuleRequestSchema>;

export const OpsTicketShowBrainSourcesRequestSchema = z.object({});

export type OpsTicketShowBrainSourcesRequest = z.infer<typeof OpsTicketShowBrainSourcesRequestSchema>;

export const api = {
  User: {
    state: UserStateSchema,
    methods: {
      ingestTextMessage: reboot_api.transaction({
        request: IngestTextRequestSchema,
        response: IngestResponseSchema,
      }),
      ingestVoiceNote: reboot_api.transaction({
        request: IngestVoiceRequestSchema,
        response: IngestResponseSchema,
      }),
      listTickets: reboot_api.reader({
        request: UserListTicketsRequestSchema,
        response: ListTicketsResponseSchema,
      }),
      queryBrain: reboot_api.reader({
        request: QueryBrainRequestSchema,
        response: QueryBrainResponseSchema,
      }),
      liveState: reboot_api.reader({
        request: UserLiveStateRequestSchema,
        response: LiveStateResponseSchema,
      }),
      create: reboot_api.writer({
        factory: {},
        request: UserCreateRequestSchema,
        response: z.void(),
      }),
    },
  },
  OpsTicket: {
    state: OpsTicketStateSchema,
    methods: {
      create: reboot_api.writer({
        factory: {},
        request: CreateTicketRequestSchema,
        response: z.void(),
      }),
      triage: reboot_api.writer({
        request: OpsTicketTriageRequestSchema,
        response: z.void(),
      }),
      acknowledgeDispatch: reboot_api.writer({
        request: AcknowledgeDispatchRequestSchema,
        response: z.void(),
      }),
      dispatchWithEscalation: reboot_api.workflow({
        request: DispatchRequestSchema,
        response: DispatchResponseSchema,
      }),
      proposeNewRule: reboot_api.writer({
        request: OpsTicketProposeNewRuleRequestSchema,
        response: ProposeNewRuleResponseSchema,
      }),
      showBrainSources: reboot_api.reader({
        request: OpsTicketShowBrainSourcesRequestSchema,
        response: ShowBrainSourcesResponseSchema,
      }),
    },
  },
};
