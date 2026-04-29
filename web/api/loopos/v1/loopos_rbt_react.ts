/* eslint-disable */
// @ts-nocheck

"use client";

import * as protobuf_es from "@bufbuild/protobuf";
import {
  Value, 
	Struct, 
	ListValue, 
	Empty
} from "@bufbuild/protobuf";
import * as reboot_react from "@reboot-dev/reboot-react";
import * as reboot_web from "@reboot-dev/reboot-web";
import * as reboot_api from "@reboot-dev/reboot-api";
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import type { App as McpApp } from "@modelcontextprotocol/ext-apps/react";
import { useMcpApp, useMcpToolData } from "@reboot-dev/reboot-react/internal";
import { useRefreshMCPBearerToken } from "@reboot-dev/reboot-react/internal";
// NOTE NOTE NOTE
//
// If you are reading this comment because you are trying to debug
// the error:
//
// Module not found: Error: Can't resolve './loopos_pb.js'
//
// You can resolve this by passing --react-extensions to `rbt
// generate` (or better put it in your `.rbtrc` file).
//
// This is a known issue if you're using `webpack` which uses
// `ts-loader` (https://github.com/TypeStrong/ts-loader/issues/465).
import {
  OpsTicket as OpsTicketProto,
  User as UserProto,
} from "./loopos_pb.js";
import * as loopos_pb from "./loopos_pb.js";

// It is important that the following is a function, so we can lazily
// initialize the cache, so users who do not use offline cache do not
// see any logs about its initialization.
export const offlineCacheStorageType = (): reboot_web.OfflineCacheStorageType =>
  reboot_web.offlineCache().offlineCacheStorageType;

reboot_api.check_bufbuild_protobuf_library(protobuf_es.Message);

export type PendingOpsTicketCreateMutation = reboot_react.Mutation<OpsTicket.CreateRequest>;
export type PendingOpsTicketTriageMutation = reboot_react.Mutation<OpsTicket.TriageRequest>;
export type PendingOpsTicketAcknowledgeDispatchMutation = reboot_react.Mutation<OpsTicket.AcknowledgeDispatchRequest>;
export type PendingOpsTicketProposeNewRuleMutation = reboot_react.Mutation<OpsTicket.ProposeNewRuleRequest>;
export type PendingUserIngestTextMessageMutation = reboot_react.Mutation<User.IngestTextMessageRequest>;
export type PendingUserIngestVoiceNoteMutation = reboot_react.Mutation<User.IngestVoiceNoteRequest>;
export type PendingUserCreateMutation = reboot_react.Mutation<User.CreateRequest>;


import { z } from "zod/v4";
import { api } from "./loopos_rbt_types.js";

const ERROR_TYPES = [
  // gRPC errors.
  reboot_api.errors_pb.Cancelled,
  reboot_api.errors_pb.Unknown,
  reboot_api.errors_pb.InvalidArgument,
  reboot_api.errors_pb.DeadlineExceeded,
  reboot_api.errors_pb.NotFound,
  reboot_api.errors_pb.AlreadyExists,
  reboot_api.errors_pb.PermissionDenied,
  reboot_api.errors_pb.ResourceExhausted,
  reboot_api.errors_pb.FailedPrecondition,
  reboot_api.errors_pb.Aborted,
  reboot_api.errors_pb.OutOfRange,
  reboot_api.errors_pb.Unimplemented,
  reboot_api.errors_pb.Internal,
  reboot_api.errors_pb.Unavailable,
  reboot_api.errors_pb.DataLoss,
  reboot_api.errors_pb.Unauthenticated,
  // Reboot errors.
  //
  // NOTE: also add any new errors into `rbt/v1alpha1/index.ts`.
  reboot_api.errors_pb.StateAlreadyConstructed,
  reboot_api.errors_pb.StateNotConstructed,
  reboot_api.errors_pb.TransactionParticipantFailedToPrepare,
  reboot_api.errors_pb.TransactionParticipantFailedToCommit,
  reboot_api.errors_pb.UnknownService,
  reboot_api.errors_pb.UnknownTask,
] as const; // Need `as const` to ensure TypeScript infers this as a tuple!

// Helper for getting the expected shape of a request, i.e., either a
// Zod shape or a protobuf instance, from a protobuf shape.
const OpsTicketCreateRequestFromProtobufShape = (
  partialRequest: protobuf_es.PartialMessage<loopos_pb.OpsTicketCreateRequest>
): OpsTicket.CreateRequest => {
  // TOOD: update `protoToZod()` to actually work from
  // any objects that match the shape, not just protobuf instances,
  // and then we won't need to first call `fromJson()` here.
  const request = partialRequest instanceof loopos_pb.OpsTicketCreateRequest
    ? partialRequest
    : loopos_pb.OpsTicketCreateRequest.fromJson(partialRequest);

  return reboot_api.validate(
    "OpsTicket.methods.create.request",
    api.OpsTicket.methods.create.request,
    reboot_api.protoToZod(
      api.OpsTicket.methods.create.request,
      request
    )
  );
};

// Helper for getting the expected shape of a request, i.e., either a
// Zod shape or a protobuf instance, from a JSON string.
const OpsTicketCreateRequestFromJsonString = (
  jsonRequest: string
): OpsTicket.CreateRequest => {
  return OpsTicketCreateRequestFromProtobufShape(
    loopos_pb.OpsTicketCreateRequest.fromJsonString(jsonRequest)
  );
};

// Helper for getting a protobuf instance for a request from the
// expected shape, i.e., either a Zod shape or a protobuf shape.
const OpsTicketCreateRequestToProtobuf = (
  partialRequest?: OpsTicket.PartialCreateRequest
): loopos_pb.OpsTicketCreateRequest => {
  return partialRequest instanceof loopos_pb.OpsTicketCreateRequest
    ? partialRequest
    : new loopos_pb.OpsTicketCreateRequest().fromJson(
      reboot_api.zodToProtoJson(
        api.OpsTicket.methods.create.request,
        reboot_api.validate(
          "OpsTicket.methods.create.request",
          api.OpsTicket.methods.create.request,
          partialRequest || {}
        )
      )
    );
};

const OpsTicketCreateResponseFromProtobufShape = (
  partialResponse: protobuf_es.PartialMessage<Empty>
) => {
  // TOOD: update `protoToZod()` to actually work from
  // any objects that match the shape, not just protobuf instances,
  // and then we won't need to first call `fromJson()` here.
  const response = partialResponse instanceof Empty
    ? partialResponse
    : Empty.fromJson(partialResponse);

  return reboot_api.validate(
    "OpsTicket.methods.create.response",
    api.OpsTicket.methods.create.response,
    reboot_api.protoToZod(
      api.OpsTicket.methods.create.response,
      response
    )
  );
};

const OpsTicketCreateResponseToProtobuf = (
  partialResponse?: OpsTicket.PartialCreateResponse
): Empty => {
  return partialResponse instanceof Empty
    ? partialResponse
    : new Empty().fromJson(
      reboot_api.zodToProtoJson(
        api.OpsTicket.methods.create.response,
        reboot_api.validate(
          "OpsTicket.methods.create.response",
          api.OpsTicket.methods.create.response,
          partialResponse
        )
      )
    );
};

// Helper for getting the expected shape of a request, i.e., either a
// Zod shape or a protobuf instance, from a protobuf shape.
const OpsTicketTriageRequestFromProtobufShape = (
  partialRequest: protobuf_es.PartialMessage<Empty>
): OpsTicket.TriageRequest => {
  // TOOD: update `protoToZod()` to actually work from
  // any objects that match the shape, not just protobuf instances,
  // and then we won't need to first call `fromJson()` here.
  const request = partialRequest instanceof Empty
    ? partialRequest
    : Empty.fromJson(partialRequest);

  return reboot_api.validate(
    "OpsTicket.methods.triage.request",
    api.OpsTicket.methods.triage.request,
    reboot_api.protoToZod(
      api.OpsTicket.methods.triage.request,
      request
    )
  );
};

// Helper for getting the expected shape of a request, i.e., either a
// Zod shape or a protobuf instance, from a JSON string.
const OpsTicketTriageRequestFromJsonString = (
  jsonRequest: string
): OpsTicket.TriageRequest => {
  return OpsTicketTriageRequestFromProtobufShape(
    Empty.fromJsonString(jsonRequest)
  );
};

// Helper for getting a protobuf instance for a request from the
// expected shape, i.e., either a Zod shape or a protobuf shape.
const OpsTicketTriageRequestToProtobuf = (
  partialRequest?: OpsTicket.PartialTriageRequest
): Empty => {
  return partialRequest instanceof Empty
    ? partialRequest
    : new Empty().fromJson(
      reboot_api.zodToProtoJson(
        api.OpsTicket.methods.triage.request,
        reboot_api.validate(
          "OpsTicket.methods.triage.request",
          api.OpsTicket.methods.triage.request,
          partialRequest || {}
        )
      )
    );
};

const OpsTicketTriageResponseFromProtobufShape = (
  partialResponse: protobuf_es.PartialMessage<Empty>
) => {
  // TOOD: update `protoToZod()` to actually work from
  // any objects that match the shape, not just protobuf instances,
  // and then we won't need to first call `fromJson()` here.
  const response = partialResponse instanceof Empty
    ? partialResponse
    : Empty.fromJson(partialResponse);

  return reboot_api.validate(
    "OpsTicket.methods.triage.response",
    api.OpsTicket.methods.triage.response,
    reboot_api.protoToZod(
      api.OpsTicket.methods.triage.response,
      response
    )
  );
};

const OpsTicketTriageResponseToProtobuf = (
  partialResponse?: OpsTicket.PartialTriageResponse
): Empty => {
  return partialResponse instanceof Empty
    ? partialResponse
    : new Empty().fromJson(
      reboot_api.zodToProtoJson(
        api.OpsTicket.methods.triage.response,
        reboot_api.validate(
          "OpsTicket.methods.triage.response",
          api.OpsTicket.methods.triage.response,
          partialResponse
        )
      )
    );
};

// Helper for getting the expected shape of a request, i.e., either a
// Zod shape or a protobuf instance, from a protobuf shape.
const OpsTicketAcknowledgeDispatchRequestFromProtobufShape = (
  partialRequest: protobuf_es.PartialMessage<loopos_pb.OpsTicketAcknowledgeDispatchRequest>
): OpsTicket.AcknowledgeDispatchRequest => {
  // TOOD: update `protoToZod()` to actually work from
  // any objects that match the shape, not just protobuf instances,
  // and then we won't need to first call `fromJson()` here.
  const request = partialRequest instanceof loopos_pb.OpsTicketAcknowledgeDispatchRequest
    ? partialRequest
    : loopos_pb.OpsTicketAcknowledgeDispatchRequest.fromJson(partialRequest);

  return reboot_api.validate(
    "OpsTicket.methods.acknowledgeDispatch.request",
    api.OpsTicket.methods.acknowledgeDispatch.request,
    reboot_api.protoToZod(
      api.OpsTicket.methods.acknowledgeDispatch.request,
      request
    )
  );
};

// Helper for getting the expected shape of a request, i.e., either a
// Zod shape or a protobuf instance, from a JSON string.
const OpsTicketAcknowledgeDispatchRequestFromJsonString = (
  jsonRequest: string
): OpsTicket.AcknowledgeDispatchRequest => {
  return OpsTicketAcknowledgeDispatchRequestFromProtobufShape(
    loopos_pb.OpsTicketAcknowledgeDispatchRequest.fromJsonString(jsonRequest)
  );
};

// Helper for getting a protobuf instance for a request from the
// expected shape, i.e., either a Zod shape or a protobuf shape.
const OpsTicketAcknowledgeDispatchRequestToProtobuf = (
  partialRequest?: OpsTicket.PartialAcknowledgeDispatchRequest
): loopos_pb.OpsTicketAcknowledgeDispatchRequest => {
  return partialRequest instanceof loopos_pb.OpsTicketAcknowledgeDispatchRequest
    ? partialRequest
    : new loopos_pb.OpsTicketAcknowledgeDispatchRequest().fromJson(
      reboot_api.zodToProtoJson(
        api.OpsTicket.methods.acknowledgeDispatch.request,
        reboot_api.validate(
          "OpsTicket.methods.acknowledgeDispatch.request",
          api.OpsTicket.methods.acknowledgeDispatch.request,
          partialRequest || {}
        )
      )
    );
};

const OpsTicketAcknowledgeDispatchResponseFromProtobufShape = (
  partialResponse: protobuf_es.PartialMessage<Empty>
) => {
  // TOOD: update `protoToZod()` to actually work from
  // any objects that match the shape, not just protobuf instances,
  // and then we won't need to first call `fromJson()` here.
  const response = partialResponse instanceof Empty
    ? partialResponse
    : Empty.fromJson(partialResponse);

  return reboot_api.validate(
    "OpsTicket.methods.acknowledgeDispatch.response",
    api.OpsTicket.methods.acknowledgeDispatch.response,
    reboot_api.protoToZod(
      api.OpsTicket.methods.acknowledgeDispatch.response,
      response
    )
  );
};

const OpsTicketAcknowledgeDispatchResponseToProtobuf = (
  partialResponse?: OpsTicket.PartialAcknowledgeDispatchResponse
): Empty => {
  return partialResponse instanceof Empty
    ? partialResponse
    : new Empty().fromJson(
      reboot_api.zodToProtoJson(
        api.OpsTicket.methods.acknowledgeDispatch.response,
        reboot_api.validate(
          "OpsTicket.methods.acknowledgeDispatch.response",
          api.OpsTicket.methods.acknowledgeDispatch.response,
          partialResponse
        )
      )
    );
};

// Helper for getting the expected shape of a request, i.e., either a
// Zod shape or a protobuf instance, from a protobuf shape.
const OpsTicketDispatchWithEscalationRequestFromProtobufShape = (
  partialRequest: protobuf_es.PartialMessage<loopos_pb.OpsTicketDispatchWithEscalationRequest>
): OpsTicket.DispatchWithEscalationRequest => {
  // TOOD: update `protoToZod()` to actually work from
  // any objects that match the shape, not just protobuf instances,
  // and then we won't need to first call `fromJson()` here.
  const request = partialRequest instanceof loopos_pb.OpsTicketDispatchWithEscalationRequest
    ? partialRequest
    : loopos_pb.OpsTicketDispatchWithEscalationRequest.fromJson(partialRequest);

  return reboot_api.validate(
    "OpsTicket.methods.dispatchWithEscalation.request",
    api.OpsTicket.methods.dispatchWithEscalation.request,
    reboot_api.protoToZod(
      api.OpsTicket.methods.dispatchWithEscalation.request,
      request
    )
  );
};

// Helper for getting the expected shape of a request, i.e., either a
// Zod shape or a protobuf instance, from a JSON string.
const OpsTicketDispatchWithEscalationRequestFromJsonString = (
  jsonRequest: string
): OpsTicket.DispatchWithEscalationRequest => {
  return OpsTicketDispatchWithEscalationRequestFromProtobufShape(
    loopos_pb.OpsTicketDispatchWithEscalationRequest.fromJsonString(jsonRequest)
  );
};

// Helper for getting a protobuf instance for a request from the
// expected shape, i.e., either a Zod shape or a protobuf shape.
const OpsTicketDispatchWithEscalationRequestToProtobuf = (
  partialRequest?: OpsTicket.PartialDispatchWithEscalationRequest
): loopos_pb.OpsTicketDispatchWithEscalationRequest => {
  return partialRequest instanceof loopos_pb.OpsTicketDispatchWithEscalationRequest
    ? partialRequest
    : new loopos_pb.OpsTicketDispatchWithEscalationRequest().fromJson(
      reboot_api.zodToProtoJson(
        api.OpsTicket.methods.dispatchWithEscalation.request,
        reboot_api.validate(
          "OpsTicket.methods.dispatchWithEscalation.request",
          api.OpsTicket.methods.dispatchWithEscalation.request,
          partialRequest || {}
        )
      )
    );
};

const OpsTicketDispatchWithEscalationResponseFromProtobufShape = (
  partialResponse: protobuf_es.PartialMessage<loopos_pb.OpsTicketDispatchWithEscalationResponse>
) => {
  // TOOD: update `protoToZod()` to actually work from
  // any objects that match the shape, not just protobuf instances,
  // and then we won't need to first call `fromJson()` here.
  const response = partialResponse instanceof loopos_pb.OpsTicketDispatchWithEscalationResponse
    ? partialResponse
    : loopos_pb.OpsTicketDispatchWithEscalationResponse.fromJson(partialResponse);

  return reboot_api.validate(
    "OpsTicket.methods.dispatchWithEscalation.response",
    api.OpsTicket.methods.dispatchWithEscalation.response,
    reboot_api.protoToZod(
      api.OpsTicket.methods.dispatchWithEscalation.response,
      response
    )
  );
};

const OpsTicketDispatchWithEscalationResponseToProtobuf = (
  partialResponse?: OpsTicket.PartialDispatchWithEscalationResponse
): loopos_pb.OpsTicketDispatchWithEscalationResponse => {
  return partialResponse instanceof loopos_pb.OpsTicketDispatchWithEscalationResponse
    ? partialResponse
    : new loopos_pb.OpsTicketDispatchWithEscalationResponse().fromJson(
      reboot_api.zodToProtoJson(
        api.OpsTicket.methods.dispatchWithEscalation.response,
        reboot_api.validate(
          "OpsTicket.methods.dispatchWithEscalation.response",
          api.OpsTicket.methods.dispatchWithEscalation.response,
          partialResponse
        )
      )
    );
};

// Helper for getting the expected shape of a request, i.e., either a
// Zod shape or a protobuf instance, from a protobuf shape.
const OpsTicketProposeNewRuleRequestFromProtobufShape = (
  partialRequest: protobuf_es.PartialMessage<Empty>
): OpsTicket.ProposeNewRuleRequest => {
  // TOOD: update `protoToZod()` to actually work from
  // any objects that match the shape, not just protobuf instances,
  // and then we won't need to first call `fromJson()` here.
  const request = partialRequest instanceof Empty
    ? partialRequest
    : Empty.fromJson(partialRequest);

  return reboot_api.validate(
    "OpsTicket.methods.proposeNewRule.request",
    api.OpsTicket.methods.proposeNewRule.request,
    reboot_api.protoToZod(
      api.OpsTicket.methods.proposeNewRule.request,
      request
    )
  );
};

// Helper for getting the expected shape of a request, i.e., either a
// Zod shape or a protobuf instance, from a JSON string.
const OpsTicketProposeNewRuleRequestFromJsonString = (
  jsonRequest: string
): OpsTicket.ProposeNewRuleRequest => {
  return OpsTicketProposeNewRuleRequestFromProtobufShape(
    Empty.fromJsonString(jsonRequest)
  );
};

// Helper for getting a protobuf instance for a request from the
// expected shape, i.e., either a Zod shape or a protobuf shape.
const OpsTicketProposeNewRuleRequestToProtobuf = (
  partialRequest?: OpsTicket.PartialProposeNewRuleRequest
): Empty => {
  return partialRequest instanceof Empty
    ? partialRequest
    : new Empty().fromJson(
      reboot_api.zodToProtoJson(
        api.OpsTicket.methods.proposeNewRule.request,
        reboot_api.validate(
          "OpsTicket.methods.proposeNewRule.request",
          api.OpsTicket.methods.proposeNewRule.request,
          partialRequest || {}
        )
      )
    );
};

const OpsTicketProposeNewRuleResponseFromProtobufShape = (
  partialResponse: protobuf_es.PartialMessage<loopos_pb.OpsTicketProposeNewRuleResponse>
) => {
  // TOOD: update `protoToZod()` to actually work from
  // any objects that match the shape, not just protobuf instances,
  // and then we won't need to first call `fromJson()` here.
  const response = partialResponse instanceof loopos_pb.OpsTicketProposeNewRuleResponse
    ? partialResponse
    : loopos_pb.OpsTicketProposeNewRuleResponse.fromJson(partialResponse);

  return reboot_api.validate(
    "OpsTicket.methods.proposeNewRule.response",
    api.OpsTicket.methods.proposeNewRule.response,
    reboot_api.protoToZod(
      api.OpsTicket.methods.proposeNewRule.response,
      response
    )
  );
};

const OpsTicketProposeNewRuleResponseToProtobuf = (
  partialResponse?: OpsTicket.PartialProposeNewRuleResponse
): loopos_pb.OpsTicketProposeNewRuleResponse => {
  return partialResponse instanceof loopos_pb.OpsTicketProposeNewRuleResponse
    ? partialResponse
    : new loopos_pb.OpsTicketProposeNewRuleResponse().fromJson(
      reboot_api.zodToProtoJson(
        api.OpsTicket.methods.proposeNewRule.response,
        reboot_api.validate(
          "OpsTicket.methods.proposeNewRule.response",
          api.OpsTicket.methods.proposeNewRule.response,
          partialResponse
        )
      )
    );
};

// Helper for getting the expected shape of a request, i.e., either a
// Zod shape or a protobuf instance, from a protobuf shape.
const OpsTicketShowBrainSourcesRequestFromProtobufShape = (
  partialRequest: protobuf_es.PartialMessage<Empty>
): OpsTicket.ShowBrainSourcesRequest => {
  // TOOD: update `protoToZod()` to actually work from
  // any objects that match the shape, not just protobuf instances,
  // and then we won't need to first call `fromJson()` here.
  const request = partialRequest instanceof Empty
    ? partialRequest
    : Empty.fromJson(partialRequest);

  return reboot_api.validate(
    "OpsTicket.methods.showBrainSources.request",
    api.OpsTicket.methods.showBrainSources.request,
    reboot_api.protoToZod(
      api.OpsTicket.methods.showBrainSources.request,
      request
    )
  );
};

// Helper for getting the expected shape of a request, i.e., either a
// Zod shape or a protobuf instance, from a JSON string.
const OpsTicketShowBrainSourcesRequestFromJsonString = (
  jsonRequest: string
): OpsTicket.ShowBrainSourcesRequest => {
  return OpsTicketShowBrainSourcesRequestFromProtobufShape(
    Empty.fromJsonString(jsonRequest)
  );
};

// Helper for getting a protobuf instance for a request from the
// expected shape, i.e., either a Zod shape or a protobuf shape.
const OpsTicketShowBrainSourcesRequestToProtobuf = (
  partialRequest?: OpsTicket.PartialShowBrainSourcesRequest
): Empty => {
  return partialRequest instanceof Empty
    ? partialRequest
    : new Empty().fromJson(
      reboot_api.zodToProtoJson(
        api.OpsTicket.methods.showBrainSources.request,
        reboot_api.validate(
          "OpsTicket.methods.showBrainSources.request",
          api.OpsTicket.methods.showBrainSources.request,
          partialRequest || {}
        )
      )
    );
};

const OpsTicketShowBrainSourcesResponseFromProtobufShape = (
  partialResponse: protobuf_es.PartialMessage<loopos_pb.OpsTicketShowBrainSourcesResponse>
) => {
  // TOOD: update `protoToZod()` to actually work from
  // any objects that match the shape, not just protobuf instances,
  // and then we won't need to first call `fromJson()` here.
  const response = partialResponse instanceof loopos_pb.OpsTicketShowBrainSourcesResponse
    ? partialResponse
    : loopos_pb.OpsTicketShowBrainSourcesResponse.fromJson(partialResponse);

  return reboot_api.validate(
    "OpsTicket.methods.showBrainSources.response",
    api.OpsTicket.methods.showBrainSources.response,
    reboot_api.protoToZod(
      api.OpsTicket.methods.showBrainSources.response,
      response
    )
  );
};

const OpsTicketShowBrainSourcesResponseToProtobuf = (
  partialResponse?: OpsTicket.PartialShowBrainSourcesResponse
): loopos_pb.OpsTicketShowBrainSourcesResponse => {
  return partialResponse instanceof loopos_pb.OpsTicketShowBrainSourcesResponse
    ? partialResponse
    : new loopos_pb.OpsTicketShowBrainSourcesResponse().fromJson(
      reboot_api.zodToProtoJson(
        api.OpsTicket.methods.showBrainSources.response,
        reboot_api.validate(
          "OpsTicket.methods.showBrainSources.response",
          api.OpsTicket.methods.showBrainSources.response,
          partialResponse
        )
      )
    );
};

// Helper for getting the expected shape of a request, i.e., either a
// Zod shape or a protobuf instance, from a protobuf shape.
const UserIngestTextMessageRequestFromProtobufShape = (
  partialRequest: protobuf_es.PartialMessage<loopos_pb.UserIngestTextMessageRequest>
): User.IngestTextMessageRequest => {
  // TOOD: update `protoToZod()` to actually work from
  // any objects that match the shape, not just protobuf instances,
  // and then we won't need to first call `fromJson()` here.
  const request = partialRequest instanceof loopos_pb.UserIngestTextMessageRequest
    ? partialRequest
    : loopos_pb.UserIngestTextMessageRequest.fromJson(partialRequest);

  return reboot_api.validate(
    "User.methods.ingestTextMessage.request",
    api.User.methods.ingestTextMessage.request,
    reboot_api.protoToZod(
      api.User.methods.ingestTextMessage.request,
      request
    )
  );
};

// Helper for getting the expected shape of a request, i.e., either a
// Zod shape or a protobuf instance, from a JSON string.
const UserIngestTextMessageRequestFromJsonString = (
  jsonRequest: string
): User.IngestTextMessageRequest => {
  return UserIngestTextMessageRequestFromProtobufShape(
    loopos_pb.UserIngestTextMessageRequest.fromJsonString(jsonRequest)
  );
};

// Helper for getting a protobuf instance for a request from the
// expected shape, i.e., either a Zod shape or a protobuf shape.
const UserIngestTextMessageRequestToProtobuf = (
  partialRequest?: User.PartialIngestTextMessageRequest
): loopos_pb.UserIngestTextMessageRequest => {
  return partialRequest instanceof loopos_pb.UserIngestTextMessageRequest
    ? partialRequest
    : new loopos_pb.UserIngestTextMessageRequest().fromJson(
      reboot_api.zodToProtoJson(
        api.User.methods.ingestTextMessage.request,
        reboot_api.validate(
          "User.methods.ingestTextMessage.request",
          api.User.methods.ingestTextMessage.request,
          partialRequest || {}
        )
      )
    );
};

const UserIngestTextMessageResponseFromProtobufShape = (
  partialResponse: protobuf_es.PartialMessage<loopos_pb.UserIngestTextMessageResponse>
) => {
  // TOOD: update `protoToZod()` to actually work from
  // any objects that match the shape, not just protobuf instances,
  // and then we won't need to first call `fromJson()` here.
  const response = partialResponse instanceof loopos_pb.UserIngestTextMessageResponse
    ? partialResponse
    : loopos_pb.UserIngestTextMessageResponse.fromJson(partialResponse);

  return reboot_api.validate(
    "User.methods.ingestTextMessage.response",
    api.User.methods.ingestTextMessage.response,
    reboot_api.protoToZod(
      api.User.methods.ingestTextMessage.response,
      response
    )
  );
};

const UserIngestTextMessageResponseToProtobuf = (
  partialResponse?: User.PartialIngestTextMessageResponse
): loopos_pb.UserIngestTextMessageResponse => {
  return partialResponse instanceof loopos_pb.UserIngestTextMessageResponse
    ? partialResponse
    : new loopos_pb.UserIngestTextMessageResponse().fromJson(
      reboot_api.zodToProtoJson(
        api.User.methods.ingestTextMessage.response,
        reboot_api.validate(
          "User.methods.ingestTextMessage.response",
          api.User.methods.ingestTextMessage.response,
          partialResponse
        )
      )
    );
};

// Helper for getting the expected shape of a request, i.e., either a
// Zod shape or a protobuf instance, from a protobuf shape.
const UserIngestVoiceNoteRequestFromProtobufShape = (
  partialRequest: protobuf_es.PartialMessage<loopos_pb.UserIngestVoiceNoteRequest>
): User.IngestVoiceNoteRequest => {
  // TOOD: update `protoToZod()` to actually work from
  // any objects that match the shape, not just protobuf instances,
  // and then we won't need to first call `fromJson()` here.
  const request = partialRequest instanceof loopos_pb.UserIngestVoiceNoteRequest
    ? partialRequest
    : loopos_pb.UserIngestVoiceNoteRequest.fromJson(partialRequest);

  return reboot_api.validate(
    "User.methods.ingestVoiceNote.request",
    api.User.methods.ingestVoiceNote.request,
    reboot_api.protoToZod(
      api.User.methods.ingestVoiceNote.request,
      request
    )
  );
};

// Helper for getting the expected shape of a request, i.e., either a
// Zod shape or a protobuf instance, from a JSON string.
const UserIngestVoiceNoteRequestFromJsonString = (
  jsonRequest: string
): User.IngestVoiceNoteRequest => {
  return UserIngestVoiceNoteRequestFromProtobufShape(
    loopos_pb.UserIngestVoiceNoteRequest.fromJsonString(jsonRequest)
  );
};

// Helper for getting a protobuf instance for a request from the
// expected shape, i.e., either a Zod shape or a protobuf shape.
const UserIngestVoiceNoteRequestToProtobuf = (
  partialRequest?: User.PartialIngestVoiceNoteRequest
): loopos_pb.UserIngestVoiceNoteRequest => {
  return partialRequest instanceof loopos_pb.UserIngestVoiceNoteRequest
    ? partialRequest
    : new loopos_pb.UserIngestVoiceNoteRequest().fromJson(
      reboot_api.zodToProtoJson(
        api.User.methods.ingestVoiceNote.request,
        reboot_api.validate(
          "User.methods.ingestVoiceNote.request",
          api.User.methods.ingestVoiceNote.request,
          partialRequest || {}
        )
      )
    );
};

const UserIngestVoiceNoteResponseFromProtobufShape = (
  partialResponse: protobuf_es.PartialMessage<loopos_pb.UserIngestVoiceNoteResponse>
) => {
  // TOOD: update `protoToZod()` to actually work from
  // any objects that match the shape, not just protobuf instances,
  // and then we won't need to first call `fromJson()` here.
  const response = partialResponse instanceof loopos_pb.UserIngestVoiceNoteResponse
    ? partialResponse
    : loopos_pb.UserIngestVoiceNoteResponse.fromJson(partialResponse);

  return reboot_api.validate(
    "User.methods.ingestVoiceNote.response",
    api.User.methods.ingestVoiceNote.response,
    reboot_api.protoToZod(
      api.User.methods.ingestVoiceNote.response,
      response
    )
  );
};

const UserIngestVoiceNoteResponseToProtobuf = (
  partialResponse?: User.PartialIngestVoiceNoteResponse
): loopos_pb.UserIngestVoiceNoteResponse => {
  return partialResponse instanceof loopos_pb.UserIngestVoiceNoteResponse
    ? partialResponse
    : new loopos_pb.UserIngestVoiceNoteResponse().fromJson(
      reboot_api.zodToProtoJson(
        api.User.methods.ingestVoiceNote.response,
        reboot_api.validate(
          "User.methods.ingestVoiceNote.response",
          api.User.methods.ingestVoiceNote.response,
          partialResponse
        )
      )
    );
};

// Helper for getting the expected shape of a request, i.e., either a
// Zod shape or a protobuf instance, from a protobuf shape.
const UserListTicketsRequestFromProtobufShape = (
  partialRequest: protobuf_es.PartialMessage<Empty>
): User.ListTicketsRequest => {
  // TOOD: update `protoToZod()` to actually work from
  // any objects that match the shape, not just protobuf instances,
  // and then we won't need to first call `fromJson()` here.
  const request = partialRequest instanceof Empty
    ? partialRequest
    : Empty.fromJson(partialRequest);

  return reboot_api.validate(
    "User.methods.listTickets.request",
    api.User.methods.listTickets.request,
    reboot_api.protoToZod(
      api.User.methods.listTickets.request,
      request
    )
  );
};

// Helper for getting the expected shape of a request, i.e., either a
// Zod shape or a protobuf instance, from a JSON string.
const UserListTicketsRequestFromJsonString = (
  jsonRequest: string
): User.ListTicketsRequest => {
  return UserListTicketsRequestFromProtobufShape(
    Empty.fromJsonString(jsonRequest)
  );
};

// Helper for getting a protobuf instance for a request from the
// expected shape, i.e., either a Zod shape or a protobuf shape.
const UserListTicketsRequestToProtobuf = (
  partialRequest?: User.PartialListTicketsRequest
): Empty => {
  return partialRequest instanceof Empty
    ? partialRequest
    : new Empty().fromJson(
      reboot_api.zodToProtoJson(
        api.User.methods.listTickets.request,
        reboot_api.validate(
          "User.methods.listTickets.request",
          api.User.methods.listTickets.request,
          partialRequest || {}
        )
      )
    );
};

const UserListTicketsResponseFromProtobufShape = (
  partialResponse: protobuf_es.PartialMessage<loopos_pb.UserListTicketsResponse>
) => {
  // TOOD: update `protoToZod()` to actually work from
  // any objects that match the shape, not just protobuf instances,
  // and then we won't need to first call `fromJson()` here.
  const response = partialResponse instanceof loopos_pb.UserListTicketsResponse
    ? partialResponse
    : loopos_pb.UserListTicketsResponse.fromJson(partialResponse);

  return reboot_api.validate(
    "User.methods.listTickets.response",
    api.User.methods.listTickets.response,
    reboot_api.protoToZod(
      api.User.methods.listTickets.response,
      response
    )
  );
};

const UserListTicketsResponseToProtobuf = (
  partialResponse?: User.PartialListTicketsResponse
): loopos_pb.UserListTicketsResponse => {
  return partialResponse instanceof loopos_pb.UserListTicketsResponse
    ? partialResponse
    : new loopos_pb.UserListTicketsResponse().fromJson(
      reboot_api.zodToProtoJson(
        api.User.methods.listTickets.response,
        reboot_api.validate(
          "User.methods.listTickets.response",
          api.User.methods.listTickets.response,
          partialResponse
        )
      )
    );
};

// Helper for getting the expected shape of a request, i.e., either a
// Zod shape or a protobuf instance, from a protobuf shape.
const UserQueryBrainRequestFromProtobufShape = (
  partialRequest: protobuf_es.PartialMessage<loopos_pb.UserQueryBrainRequest>
): User.QueryBrainRequest => {
  // TOOD: update `protoToZod()` to actually work from
  // any objects that match the shape, not just protobuf instances,
  // and then we won't need to first call `fromJson()` here.
  const request = partialRequest instanceof loopos_pb.UserQueryBrainRequest
    ? partialRequest
    : loopos_pb.UserQueryBrainRequest.fromJson(partialRequest);

  return reboot_api.validate(
    "User.methods.queryBrain.request",
    api.User.methods.queryBrain.request,
    reboot_api.protoToZod(
      api.User.methods.queryBrain.request,
      request
    )
  );
};

// Helper for getting the expected shape of a request, i.e., either a
// Zod shape or a protobuf instance, from a JSON string.
const UserQueryBrainRequestFromJsonString = (
  jsonRequest: string
): User.QueryBrainRequest => {
  return UserQueryBrainRequestFromProtobufShape(
    loopos_pb.UserQueryBrainRequest.fromJsonString(jsonRequest)
  );
};

// Helper for getting a protobuf instance for a request from the
// expected shape, i.e., either a Zod shape or a protobuf shape.
const UserQueryBrainRequestToProtobuf = (
  partialRequest?: User.PartialQueryBrainRequest
): loopos_pb.UserQueryBrainRequest => {
  return partialRequest instanceof loopos_pb.UserQueryBrainRequest
    ? partialRequest
    : new loopos_pb.UserQueryBrainRequest().fromJson(
      reboot_api.zodToProtoJson(
        api.User.methods.queryBrain.request,
        reboot_api.validate(
          "User.methods.queryBrain.request",
          api.User.methods.queryBrain.request,
          partialRequest || {}
        )
      )
    );
};

const UserQueryBrainResponseFromProtobufShape = (
  partialResponse: protobuf_es.PartialMessage<loopos_pb.UserQueryBrainResponse>
) => {
  // TOOD: update `protoToZod()` to actually work from
  // any objects that match the shape, not just protobuf instances,
  // and then we won't need to first call `fromJson()` here.
  const response = partialResponse instanceof loopos_pb.UserQueryBrainResponse
    ? partialResponse
    : loopos_pb.UserQueryBrainResponse.fromJson(partialResponse);

  return reboot_api.validate(
    "User.methods.queryBrain.response",
    api.User.methods.queryBrain.response,
    reboot_api.protoToZod(
      api.User.methods.queryBrain.response,
      response
    )
  );
};

const UserQueryBrainResponseToProtobuf = (
  partialResponse?: User.PartialQueryBrainResponse
): loopos_pb.UserQueryBrainResponse => {
  return partialResponse instanceof loopos_pb.UserQueryBrainResponse
    ? partialResponse
    : new loopos_pb.UserQueryBrainResponse().fromJson(
      reboot_api.zodToProtoJson(
        api.User.methods.queryBrain.response,
        reboot_api.validate(
          "User.methods.queryBrain.response",
          api.User.methods.queryBrain.response,
          partialResponse
        )
      )
    );
};

// Helper for getting the expected shape of a request, i.e., either a
// Zod shape or a protobuf instance, from a protobuf shape.
const UserLiveStateRequestFromProtobufShape = (
  partialRequest: protobuf_es.PartialMessage<Empty>
): User.LiveStateRequest => {
  // TOOD: update `protoToZod()` to actually work from
  // any objects that match the shape, not just protobuf instances,
  // and then we won't need to first call `fromJson()` here.
  const request = partialRequest instanceof Empty
    ? partialRequest
    : Empty.fromJson(partialRequest);

  return reboot_api.validate(
    "User.methods.liveState.request",
    api.User.methods.liveState.request,
    reboot_api.protoToZod(
      api.User.methods.liveState.request,
      request
    )
  );
};

// Helper for getting the expected shape of a request, i.e., either a
// Zod shape or a protobuf instance, from a JSON string.
const UserLiveStateRequestFromJsonString = (
  jsonRequest: string
): User.LiveStateRequest => {
  return UserLiveStateRequestFromProtobufShape(
    Empty.fromJsonString(jsonRequest)
  );
};

// Helper for getting a protobuf instance for a request from the
// expected shape, i.e., either a Zod shape or a protobuf shape.
const UserLiveStateRequestToProtobuf = (
  partialRequest?: User.PartialLiveStateRequest
): Empty => {
  return partialRequest instanceof Empty
    ? partialRequest
    : new Empty().fromJson(
      reboot_api.zodToProtoJson(
        api.User.methods.liveState.request,
        reboot_api.validate(
          "User.methods.liveState.request",
          api.User.methods.liveState.request,
          partialRequest || {}
        )
      )
    );
};

const UserLiveStateResponseFromProtobufShape = (
  partialResponse: protobuf_es.PartialMessage<loopos_pb.UserLiveStateResponse>
) => {
  // TOOD: update `protoToZod()` to actually work from
  // any objects that match the shape, not just protobuf instances,
  // and then we won't need to first call `fromJson()` here.
  const response = partialResponse instanceof loopos_pb.UserLiveStateResponse
    ? partialResponse
    : loopos_pb.UserLiveStateResponse.fromJson(partialResponse);

  return reboot_api.validate(
    "User.methods.liveState.response",
    api.User.methods.liveState.response,
    reboot_api.protoToZod(
      api.User.methods.liveState.response,
      response
    )
  );
};

const UserLiveStateResponseToProtobuf = (
  partialResponse?: User.PartialLiveStateResponse
): loopos_pb.UserLiveStateResponse => {
  return partialResponse instanceof loopos_pb.UserLiveStateResponse
    ? partialResponse
    : new loopos_pb.UserLiveStateResponse().fromJson(
      reboot_api.zodToProtoJson(
        api.User.methods.liveState.response,
        reboot_api.validate(
          "User.methods.liveState.response",
          api.User.methods.liveState.response,
          partialResponse
        )
      )
    );
};

// Helper for getting the expected shape of a request, i.e., either a
// Zod shape or a protobuf instance, from a protobuf shape.
const UserCostSummaryRequestFromProtobufShape = (
  partialRequest: protobuf_es.PartialMessage<Empty>
): User.CostSummaryRequest => {
  // TOOD: update `protoToZod()` to actually work from
  // any objects that match the shape, not just protobuf instances,
  // and then we won't need to first call `fromJson()` here.
  const request = partialRequest instanceof Empty
    ? partialRequest
    : Empty.fromJson(partialRequest);

  return reboot_api.validate(
    "User.methods.costSummary.request",
    api.User.methods.costSummary.request,
    reboot_api.protoToZod(
      api.User.methods.costSummary.request,
      request
    )
  );
};

// Helper for getting the expected shape of a request, i.e., either a
// Zod shape or a protobuf instance, from a JSON string.
const UserCostSummaryRequestFromJsonString = (
  jsonRequest: string
): User.CostSummaryRequest => {
  return UserCostSummaryRequestFromProtobufShape(
    Empty.fromJsonString(jsonRequest)
  );
};

// Helper for getting a protobuf instance for a request from the
// expected shape, i.e., either a Zod shape or a protobuf shape.
const UserCostSummaryRequestToProtobuf = (
  partialRequest?: User.PartialCostSummaryRequest
): Empty => {
  return partialRequest instanceof Empty
    ? partialRequest
    : new Empty().fromJson(
      reboot_api.zodToProtoJson(
        api.User.methods.costSummary.request,
        reboot_api.validate(
          "User.methods.costSummary.request",
          api.User.methods.costSummary.request,
          partialRequest || {}
        )
      )
    );
};

const UserCostSummaryResponseFromProtobufShape = (
  partialResponse: protobuf_es.PartialMessage<loopos_pb.UserCostSummaryResponse>
) => {
  // TOOD: update `protoToZod()` to actually work from
  // any objects that match the shape, not just protobuf instances,
  // and then we won't need to first call `fromJson()` here.
  const response = partialResponse instanceof loopos_pb.UserCostSummaryResponse
    ? partialResponse
    : loopos_pb.UserCostSummaryResponse.fromJson(partialResponse);

  return reboot_api.validate(
    "User.methods.costSummary.response",
    api.User.methods.costSummary.response,
    reboot_api.protoToZod(
      api.User.methods.costSummary.response,
      response
    )
  );
};

const UserCostSummaryResponseToProtobuf = (
  partialResponse?: User.PartialCostSummaryResponse
): loopos_pb.UserCostSummaryResponse => {
  return partialResponse instanceof loopos_pb.UserCostSummaryResponse
    ? partialResponse
    : new loopos_pb.UserCostSummaryResponse().fromJson(
      reboot_api.zodToProtoJson(
        api.User.methods.costSummary.response,
        reboot_api.validate(
          "User.methods.costSummary.response",
          api.User.methods.costSummary.response,
          partialResponse
        )
      )
    );
};

// Helper for getting the expected shape of a request, i.e., either a
// Zod shape or a protobuf instance, from a protobuf shape.
const UserCreateRequestFromProtobufShape = (
  partialRequest: protobuf_es.PartialMessage<Empty>
): User.CreateRequest => {
  // TOOD: update `protoToZod()` to actually work from
  // any objects that match the shape, not just protobuf instances,
  // and then we won't need to first call `fromJson()` here.
  const request = partialRequest instanceof Empty
    ? partialRequest
    : Empty.fromJson(partialRequest);

  return reboot_api.validate(
    "User.methods.create.request",
    api.User.methods.create.request,
    reboot_api.protoToZod(
      api.User.methods.create.request,
      request
    )
  );
};

// Helper for getting the expected shape of a request, i.e., either a
// Zod shape or a protobuf instance, from a JSON string.
const UserCreateRequestFromJsonString = (
  jsonRequest: string
): User.CreateRequest => {
  return UserCreateRequestFromProtobufShape(
    Empty.fromJsonString(jsonRequest)
  );
};

// Helper for getting a protobuf instance for a request from the
// expected shape, i.e., either a Zod shape or a protobuf shape.
const UserCreateRequestToProtobuf = (
  partialRequest?: User.PartialCreateRequest
): Empty => {
  return partialRequest instanceof Empty
    ? partialRequest
    : new Empty().fromJson(
      reboot_api.zodToProtoJson(
        api.User.methods.create.request,
        reboot_api.validate(
          "User.methods.create.request",
          api.User.methods.create.request,
          partialRequest || {}
        )
      )
    );
};

const UserCreateResponseFromProtobufShape = (
  partialResponse: protobuf_es.PartialMessage<Empty>
) => {
  // TOOD: update `protoToZod()` to actually work from
  // any objects that match the shape, not just protobuf instances,
  // and then we won't need to first call `fromJson()` here.
  const response = partialResponse instanceof Empty
    ? partialResponse
    : Empty.fromJson(partialResponse);

  return reboot_api.validate(
    "User.methods.create.response",
    api.User.methods.create.response,
    reboot_api.protoToZod(
      api.User.methods.create.response,
      response
    )
  );
};

const UserCreateResponseToProtobuf = (
  partialResponse?: User.PartialCreateResponse
): Empty => {
  return partialResponse instanceof Empty
    ? partialResponse
    : new Empty().fromJson(
      reboot_api.zodToProtoJson(
        api.User.methods.create.response,
        reboot_api.validate(
          "User.methods.create.response",
          api.User.methods.create.response,
          partialResponse
        )
      )
    );
};



export namespace OpsTicket {
  export type CreateRequest =
  z.infer<
    reboot_api.EnsureZodObject<
      typeof api.OpsTicket.methods.create.request
      >
    >;

  export type PartialCreateRequest =
  CreateRequest;

  export type CreateResponse =
  z.infer<
    reboot_api.EnsureZodObject<
      typeof api.OpsTicket.methods.create.response
      >
    >;

  export type PartialCreateResponse =
  CreateResponse;
}
export namespace OpsTicket {
  export type TriageRequest =
  z.infer<
    reboot_api.EnsureZodObject<
      typeof api.OpsTicket.methods.triage.request
      >
    >;

  export type PartialTriageRequest =
  TriageRequest;

  export type TriageResponse =
  z.infer<
    reboot_api.EnsureZodObject<
      typeof api.OpsTicket.methods.triage.response
      >
    >;

  export type PartialTriageResponse =
  TriageResponse;
}
export namespace OpsTicket {
  export type AcknowledgeDispatchRequest =
  z.infer<
    reboot_api.EnsureZodObject<
      typeof api.OpsTicket.methods.acknowledgeDispatch.request
      >
    >;

  export type PartialAcknowledgeDispatchRequest =
  AcknowledgeDispatchRequest;

  export type AcknowledgeDispatchResponse =
  z.infer<
    reboot_api.EnsureZodObject<
      typeof api.OpsTicket.methods.acknowledgeDispatch.response
      >
    >;

  export type PartialAcknowledgeDispatchResponse =
  AcknowledgeDispatchResponse;
}
export namespace OpsTicket {
  export type DispatchWithEscalationRequest =
  z.infer<
    reboot_api.EnsureZodObject<
      typeof api.OpsTicket.methods.dispatchWithEscalation.request
      >
    >;

  export type PartialDispatchWithEscalationRequest =
  DispatchWithEscalationRequest;

  export type DispatchWithEscalationResponse =
  z.infer<
    reboot_api.EnsureZodObject<
      typeof api.OpsTicket.methods.dispatchWithEscalation.response
      >
    >;

  export type PartialDispatchWithEscalationResponse =
  DispatchWithEscalationResponse;
}
export namespace OpsTicket {
  export type ProposeNewRuleRequest =
  z.infer<
    reboot_api.EnsureZodObject<
      typeof api.OpsTicket.methods.proposeNewRule.request
      >
    >;

  export type PartialProposeNewRuleRequest =
  ProposeNewRuleRequest;

  export type ProposeNewRuleResponse =
  z.infer<
    reboot_api.EnsureZodObject<
      typeof api.OpsTicket.methods.proposeNewRule.response
      >
    >;

  export type PartialProposeNewRuleResponse =
  ProposeNewRuleResponse;
}
export namespace OpsTicket {
  export type ShowBrainSourcesRequest =
  z.infer<
    reboot_api.EnsureZodObject<
      typeof api.OpsTicket.methods.showBrainSources.request
      >
    >;

  export type PartialShowBrainSourcesRequest =
  ShowBrainSourcesRequest;

  export type ShowBrainSourcesResponse =
  z.infer<
    reboot_api.EnsureZodObject<
      typeof api.OpsTicket.methods.showBrainSources.response
      >
    >;

  export type PartialShowBrainSourcesResponse =
  ShowBrainSourcesResponse;
}

export interface OpsTicketMutators {
  create: {
    // Mutators are functions and can be called directly.
    (partialRequest?: OpsTicket.PartialCreateRequest,
     options?: { metadata?: any, idempotencyKey?: string }
    ): Promise<
      reboot_web.ResponseOrAborted<
        OpsTicket.CreateResponse,
        OpsTicketCreateAborted
      >>;

    pending: PendingOpsTicketCreateMutation[];
  };
  triage: {
    // Mutators are functions and can be called directly.
    (partialRequest?: OpsTicket.PartialTriageRequest,
     options?: { metadata?: any, idempotencyKey?: string }
    ): Promise<
      reboot_web.ResponseOrAborted<
        OpsTicket.TriageResponse,
        OpsTicketTriageAborted
      >>;

    pending: PendingOpsTicketTriageMutation[];
  };
  acknowledgeDispatch: {
    // Mutators are functions and can be called directly.
    (partialRequest?: OpsTicket.PartialAcknowledgeDispatchRequest,
     options?: { metadata?: any, idempotencyKey?: string }
    ): Promise<
      reboot_web.ResponseOrAborted<
        OpsTicket.AcknowledgeDispatchResponse,
        OpsTicketAcknowledgeDispatchAborted
      >>;

    pending: PendingOpsTicketAcknowledgeDispatchMutation[];
  };
  proposeNewRule: {
    // Mutators are functions and can be called directly.
    (partialRequest?: OpsTicket.PartialProposeNewRuleRequest,
     options?: { metadata?: any, idempotencyKey?: string }
    ): Promise<
      reboot_web.ResponseOrAborted<
        OpsTicket.ProposeNewRuleResponse,
        OpsTicketProposeNewRuleAborted
      >>;

    pending: PendingOpsTicketProposeNewRuleMutation[];
  };
}

export interface OpsTicketIdempotently {
  create: {
    // Idempotent calls are functions and can be called directly.
    (partialRequest?: OpsTicket.PartialCreateRequest,
     options?: { metadata?: any }
    ): Promise<
      reboot_web.ResponseOrAborted<
        OpsTicket.CreateResponse,
        OpsTicketCreateAborted
      >>;

    pending: PendingOpsTicketCreateMutation[];
  };
  triage: {
    // Idempotent calls are functions and can be called directly.
    (partialRequest?: OpsTicket.PartialTriageRequest,
     options?: { metadata?: any }
    ): Promise<
      reboot_web.ResponseOrAborted<
        OpsTicket.TriageResponse,
        OpsTicketTriageAborted
      >>;

    pending: PendingOpsTicketTriageMutation[];
  };
  acknowledgeDispatch: {
    // Idempotent calls are functions and can be called directly.
    (partialRequest?: OpsTicket.PartialAcknowledgeDispatchRequest,
     options?: { metadata?: any }
    ): Promise<
      reboot_web.ResponseOrAborted<
        OpsTicket.AcknowledgeDispatchResponse,
        OpsTicketAcknowledgeDispatchAborted
      >>;

    pending: PendingOpsTicketAcknowledgeDispatchMutation[];
  };
  proposeNewRule: {
    // Idempotent calls are functions and can be called directly.
    (partialRequest?: OpsTicket.PartialProposeNewRuleRequest,
     options?: { metadata?: any }
    ): Promise<
      reboot_web.ResponseOrAborted<
        OpsTicket.ProposeNewRuleResponse,
        OpsTicketProposeNewRuleAborted
      >>;

    pending: PendingOpsTicketProposeNewRuleMutation[];
  };
}



const OPS_TICKET_CREATE_ERROR_TYPES = [
  ...ERROR_TYPES,

  // Method errors.
] as const; // Need `as const` to ensure TypeScript infers this as a tuple!

export type OpsTicketCreateAbortedError =
  reboot_api.InstanceTypeForErrorTypes<
    typeof OPS_TICKET_CREATE_ERROR_TYPES
  >[number];

export class OpsTicketCreateAborted extends reboot_api.Aborted {
  static fromStatus(status: reboot_api.Status) {
    let error = reboot_api.errorFromGoogleRpcStatusDetails(
      status,
      OPS_TICKET_CREATE_ERROR_TYPES,
    );

    if (error !== undefined) {
      return new OpsTicketCreateAborted(
        error, { message: status.message }
      );
    }

    error = reboot_api.errorFromGoogleRpcStatusCode(status);

    // TODO(benh): also consider getting the type names from
    // `status.details` and including that in `message` to make
    // debugging easier.

    return new OpsTicketCreateAborted(
      error, { message: status.message }
    );
  }

  public toStatus(): reboot_api.Status {
    const isObject = (value: unknown): value is object => {
      return typeof value === 'object';
    };

    const isArray = (value: unknown): value is any[]  => {
      return Array.isArray(value);
    };

    const error = this.#error.toJson();

    if (!isObject(error) || isArray(error)) {
      throw new Error("Expecting 'error' to be an object (and not an array)");
    }

    const detail = { ...error };
    detail["@type"] = `type.googleapis.com/${this.#error.getType().typeName}`;

    return new reboot_api.Status({
      code: this.code,
      message: this.#message,
      details: [detail]
    });
  }

  constructor(
    error: OpsTicketCreateAbortedError | z.infer<typeof reboot_api.ZOD_ERRORS>,
    { message }: { message?: string } = {}
  ) {
    super();

    // Set the name of this error for even more information!
    this.name = this.constructor.name;

    if (error instanceof protobuf_es.Message) {
      this.#error = error;
    } else if (!("type" in error)) {
      throw new Error("Expecting discriminator 'type' in error");
    } else if (reboot_api.ZOD_ERROR_NAMES.includes(error.type)) {
      this.#error = reboot_api.errorFromZodError(error);
    } else {
      throw new Error(`Unknown 'type' discriminator '${error.type}' in error`);
    }

    let code = reboot_api.grpcStatusCodeFromError(this.#error);

    if (code === undefined) {
      // Must be one of the Reboot specific errors.
      code = reboot_api.StatusCode.ABORTED;
    }

    this.code = code;

    this.#message = message;
  }

  toString(): string {
    return `${this.name}: ${this.message}`;
  }

  get message(): string {
    return `${this.#error.getType().typeName}${this.#message ? ": " + this.#message : ""}`;
  }

  get error(): z.infer<typeof reboot_api.ZOD_ERRORS> {
    reboot_api.assert(this.#error instanceof protobuf_es.Message);
    // Non-declared errors (e.g., gRPC errors).
    return reboot_api.zodErrorFromError(this.#error);
  }

  readonly #error: OpsTicketCreateAbortedError;
  readonly code: reboot_api.StatusCode;
  readonly #message?: string;
}



const OPS_TICKET_TRIAGE_ERROR_TYPES = [
  ...ERROR_TYPES,

  // Method errors.
] as const; // Need `as const` to ensure TypeScript infers this as a tuple!

export type OpsTicketTriageAbortedError =
  reboot_api.InstanceTypeForErrorTypes<
    typeof OPS_TICKET_TRIAGE_ERROR_TYPES
  >[number];

export class OpsTicketTriageAborted extends reboot_api.Aborted {
  static fromStatus(status: reboot_api.Status) {
    let error = reboot_api.errorFromGoogleRpcStatusDetails(
      status,
      OPS_TICKET_TRIAGE_ERROR_TYPES,
    );

    if (error !== undefined) {
      return new OpsTicketTriageAborted(
        error, { message: status.message }
      );
    }

    error = reboot_api.errorFromGoogleRpcStatusCode(status);

    // TODO(benh): also consider getting the type names from
    // `status.details` and including that in `message` to make
    // debugging easier.

    return new OpsTicketTriageAborted(
      error, { message: status.message }
    );
  }

  public toStatus(): reboot_api.Status {
    const isObject = (value: unknown): value is object => {
      return typeof value === 'object';
    };

    const isArray = (value: unknown): value is any[]  => {
      return Array.isArray(value);
    };

    const error = this.#error.toJson();

    if (!isObject(error) || isArray(error)) {
      throw new Error("Expecting 'error' to be an object (and not an array)");
    }

    const detail = { ...error };
    detail["@type"] = `type.googleapis.com/${this.#error.getType().typeName}`;

    return new reboot_api.Status({
      code: this.code,
      message: this.#message,
      details: [detail]
    });
  }

  constructor(
    error: OpsTicketTriageAbortedError | z.infer<typeof reboot_api.ZOD_ERRORS>,
    { message }: { message?: string } = {}
  ) {
    super();

    // Set the name of this error for even more information!
    this.name = this.constructor.name;

    if (error instanceof protobuf_es.Message) {
      this.#error = error;
    } else if (!("type" in error)) {
      throw new Error("Expecting discriminator 'type' in error");
    } else if (reboot_api.ZOD_ERROR_NAMES.includes(error.type)) {
      this.#error = reboot_api.errorFromZodError(error);
    } else {
      throw new Error(`Unknown 'type' discriminator '${error.type}' in error`);
    }

    let code = reboot_api.grpcStatusCodeFromError(this.#error);

    if (code === undefined) {
      // Must be one of the Reboot specific errors.
      code = reboot_api.StatusCode.ABORTED;
    }

    this.code = code;

    this.#message = message;
  }

  toString(): string {
    return `${this.name}: ${this.message}`;
  }

  get message(): string {
    return `${this.#error.getType().typeName}${this.#message ? ": " + this.#message : ""}`;
  }

  get error(): z.infer<typeof reboot_api.ZOD_ERRORS> {
    reboot_api.assert(this.#error instanceof protobuf_es.Message);
    // Non-declared errors (e.g., gRPC errors).
    return reboot_api.zodErrorFromError(this.#error);
  }

  readonly #error: OpsTicketTriageAbortedError;
  readonly code: reboot_api.StatusCode;
  readonly #message?: string;
}



const OPS_TICKET_ACKNOWLEDGE_DISPATCH_ERROR_TYPES = [
  ...ERROR_TYPES,

  // Method errors.
] as const; // Need `as const` to ensure TypeScript infers this as a tuple!

export type OpsTicketAcknowledgeDispatchAbortedError =
  reboot_api.InstanceTypeForErrorTypes<
    typeof OPS_TICKET_ACKNOWLEDGE_DISPATCH_ERROR_TYPES
  >[number];

export class OpsTicketAcknowledgeDispatchAborted extends reboot_api.Aborted {
  static fromStatus(status: reboot_api.Status) {
    let error = reboot_api.errorFromGoogleRpcStatusDetails(
      status,
      OPS_TICKET_ACKNOWLEDGE_DISPATCH_ERROR_TYPES,
    );

    if (error !== undefined) {
      return new OpsTicketAcknowledgeDispatchAborted(
        error, { message: status.message }
      );
    }

    error = reboot_api.errorFromGoogleRpcStatusCode(status);

    // TODO(benh): also consider getting the type names from
    // `status.details` and including that in `message` to make
    // debugging easier.

    return new OpsTicketAcknowledgeDispatchAborted(
      error, { message: status.message }
    );
  }

  public toStatus(): reboot_api.Status {
    const isObject = (value: unknown): value is object => {
      return typeof value === 'object';
    };

    const isArray = (value: unknown): value is any[]  => {
      return Array.isArray(value);
    };

    const error = this.#error.toJson();

    if (!isObject(error) || isArray(error)) {
      throw new Error("Expecting 'error' to be an object (and not an array)");
    }

    const detail = { ...error };
    detail["@type"] = `type.googleapis.com/${this.#error.getType().typeName}`;

    return new reboot_api.Status({
      code: this.code,
      message: this.#message,
      details: [detail]
    });
  }

  constructor(
    error: OpsTicketAcknowledgeDispatchAbortedError | z.infer<typeof reboot_api.ZOD_ERRORS>,
    { message }: { message?: string } = {}
  ) {
    super();

    // Set the name of this error for even more information!
    this.name = this.constructor.name;

    if (error instanceof protobuf_es.Message) {
      this.#error = error;
    } else if (!("type" in error)) {
      throw new Error("Expecting discriminator 'type' in error");
    } else if (reboot_api.ZOD_ERROR_NAMES.includes(error.type)) {
      this.#error = reboot_api.errorFromZodError(error);
    } else {
      throw new Error(`Unknown 'type' discriminator '${error.type}' in error`);
    }

    let code = reboot_api.grpcStatusCodeFromError(this.#error);

    if (code === undefined) {
      // Must be one of the Reboot specific errors.
      code = reboot_api.StatusCode.ABORTED;
    }

    this.code = code;

    this.#message = message;
  }

  toString(): string {
    return `${this.name}: ${this.message}`;
  }

  get message(): string {
    return `${this.#error.getType().typeName}${this.#message ? ": " + this.#message : ""}`;
  }

  get error(): z.infer<typeof reboot_api.ZOD_ERRORS> {
    reboot_api.assert(this.#error instanceof protobuf_es.Message);
    // Non-declared errors (e.g., gRPC errors).
    return reboot_api.zodErrorFromError(this.#error);
  }

  readonly #error: OpsTicketAcknowledgeDispatchAbortedError;
  readonly code: reboot_api.StatusCode;
  readonly #message?: string;
}



const OPS_TICKET_DISPATCH_WITH_ESCALATION_ERROR_TYPES = [
  ...ERROR_TYPES,

  // Method errors.
] as const; // Need `as const` to ensure TypeScript infers this as a tuple!

export type OpsTicketDispatchWithEscalationAbortedError =
  reboot_api.InstanceTypeForErrorTypes<
    typeof OPS_TICKET_DISPATCH_WITH_ESCALATION_ERROR_TYPES
  >[number];

export class OpsTicketDispatchWithEscalationAborted extends reboot_api.Aborted {
  static fromStatus(status: reboot_api.Status) {
    let error = reboot_api.errorFromGoogleRpcStatusDetails(
      status,
      OPS_TICKET_DISPATCH_WITH_ESCALATION_ERROR_TYPES,
    );

    if (error !== undefined) {
      return new OpsTicketDispatchWithEscalationAborted(
        error, { message: status.message }
      );
    }

    error = reboot_api.errorFromGoogleRpcStatusCode(status);

    // TODO(benh): also consider getting the type names from
    // `status.details` and including that in `message` to make
    // debugging easier.

    return new OpsTicketDispatchWithEscalationAborted(
      error, { message: status.message }
    );
  }

  public toStatus(): reboot_api.Status {
    const isObject = (value: unknown): value is object => {
      return typeof value === 'object';
    };

    const isArray = (value: unknown): value is any[]  => {
      return Array.isArray(value);
    };

    const error = this.#error.toJson();

    if (!isObject(error) || isArray(error)) {
      throw new Error("Expecting 'error' to be an object (and not an array)");
    }

    const detail = { ...error };
    detail["@type"] = `type.googleapis.com/${this.#error.getType().typeName}`;

    return new reboot_api.Status({
      code: this.code,
      message: this.#message,
      details: [detail]
    });
  }

  constructor(
    error: OpsTicketDispatchWithEscalationAbortedError | z.infer<typeof reboot_api.ZOD_ERRORS>,
    { message }: { message?: string } = {}
  ) {
    super();

    // Set the name of this error for even more information!
    this.name = this.constructor.name;

    if (error instanceof protobuf_es.Message) {
      this.#error = error;
    } else if (!("type" in error)) {
      throw new Error("Expecting discriminator 'type' in error");
    } else if (reboot_api.ZOD_ERROR_NAMES.includes(error.type)) {
      this.#error = reboot_api.errorFromZodError(error);
    } else {
      throw new Error(`Unknown 'type' discriminator '${error.type}' in error`);
    }

    let code = reboot_api.grpcStatusCodeFromError(this.#error);

    if (code === undefined) {
      // Must be one of the Reboot specific errors.
      code = reboot_api.StatusCode.ABORTED;
    }

    this.code = code;

    this.#message = message;
  }

  toString(): string {
    return `${this.name}: ${this.message}`;
  }

  get message(): string {
    return `${this.#error.getType().typeName}${this.#message ? ": " + this.#message : ""}`;
  }

  get error(): z.infer<typeof reboot_api.ZOD_ERRORS> {
    reboot_api.assert(this.#error instanceof protobuf_es.Message);
    // Non-declared errors (e.g., gRPC errors).
    return reboot_api.zodErrorFromError(this.#error);
  }

  readonly #error: OpsTicketDispatchWithEscalationAbortedError;
  readonly code: reboot_api.StatusCode;
  readonly #message?: string;
}



const OPS_TICKET_PROPOSE_NEW_RULE_ERROR_TYPES = [
  ...ERROR_TYPES,

  // Method errors.
] as const; // Need `as const` to ensure TypeScript infers this as a tuple!

export type OpsTicketProposeNewRuleAbortedError =
  reboot_api.InstanceTypeForErrorTypes<
    typeof OPS_TICKET_PROPOSE_NEW_RULE_ERROR_TYPES
  >[number];

export class OpsTicketProposeNewRuleAborted extends reboot_api.Aborted {
  static fromStatus(status: reboot_api.Status) {
    let error = reboot_api.errorFromGoogleRpcStatusDetails(
      status,
      OPS_TICKET_PROPOSE_NEW_RULE_ERROR_TYPES,
    );

    if (error !== undefined) {
      return new OpsTicketProposeNewRuleAborted(
        error, { message: status.message }
      );
    }

    error = reboot_api.errorFromGoogleRpcStatusCode(status);

    // TODO(benh): also consider getting the type names from
    // `status.details` and including that in `message` to make
    // debugging easier.

    return new OpsTicketProposeNewRuleAborted(
      error, { message: status.message }
    );
  }

  public toStatus(): reboot_api.Status {
    const isObject = (value: unknown): value is object => {
      return typeof value === 'object';
    };

    const isArray = (value: unknown): value is any[]  => {
      return Array.isArray(value);
    };

    const error = this.#error.toJson();

    if (!isObject(error) || isArray(error)) {
      throw new Error("Expecting 'error' to be an object (and not an array)");
    }

    const detail = { ...error };
    detail["@type"] = `type.googleapis.com/${this.#error.getType().typeName}`;

    return new reboot_api.Status({
      code: this.code,
      message: this.#message,
      details: [detail]
    });
  }

  constructor(
    error: OpsTicketProposeNewRuleAbortedError | z.infer<typeof reboot_api.ZOD_ERRORS>,
    { message }: { message?: string } = {}
  ) {
    super();

    // Set the name of this error for even more information!
    this.name = this.constructor.name;

    if (error instanceof protobuf_es.Message) {
      this.#error = error;
    } else if (!("type" in error)) {
      throw new Error("Expecting discriminator 'type' in error");
    } else if (reboot_api.ZOD_ERROR_NAMES.includes(error.type)) {
      this.#error = reboot_api.errorFromZodError(error);
    } else {
      throw new Error(`Unknown 'type' discriminator '${error.type}' in error`);
    }

    let code = reboot_api.grpcStatusCodeFromError(this.#error);

    if (code === undefined) {
      // Must be one of the Reboot specific errors.
      code = reboot_api.StatusCode.ABORTED;
    }

    this.code = code;

    this.#message = message;
  }

  toString(): string {
    return `${this.name}: ${this.message}`;
  }

  get message(): string {
    return `${this.#error.getType().typeName}${this.#message ? ": " + this.#message : ""}`;
  }

  get error(): z.infer<typeof reboot_api.ZOD_ERRORS> {
    reboot_api.assert(this.#error instanceof protobuf_es.Message);
    // Non-declared errors (e.g., gRPC errors).
    return reboot_api.zodErrorFromError(this.#error);
  }

  readonly #error: OpsTicketProposeNewRuleAbortedError;
  readonly code: reboot_api.StatusCode;
  readonly #message?: string;
}



const OPS_TICKET_SHOW_BRAIN_SOURCES_ERROR_TYPES = [
  ...ERROR_TYPES,

  // Method errors.
] as const; // Need `as const` to ensure TypeScript infers this as a tuple!

export type OpsTicketShowBrainSourcesAbortedError =
  reboot_api.InstanceTypeForErrorTypes<
    typeof OPS_TICKET_SHOW_BRAIN_SOURCES_ERROR_TYPES
  >[number];

export class OpsTicketShowBrainSourcesAborted extends reboot_api.Aborted {
  static fromStatus(status: reboot_api.Status) {
    let error = reboot_api.errorFromGoogleRpcStatusDetails(
      status,
      OPS_TICKET_SHOW_BRAIN_SOURCES_ERROR_TYPES,
    );

    if (error !== undefined) {
      return new OpsTicketShowBrainSourcesAborted(
        error, { message: status.message }
      );
    }

    error = reboot_api.errorFromGoogleRpcStatusCode(status);

    // TODO(benh): also consider getting the type names from
    // `status.details` and including that in `message` to make
    // debugging easier.

    return new OpsTicketShowBrainSourcesAborted(
      error, { message: status.message }
    );
  }

  public toStatus(): reboot_api.Status {
    const isObject = (value: unknown): value is object => {
      return typeof value === 'object';
    };

    const isArray = (value: unknown): value is any[]  => {
      return Array.isArray(value);
    };

    const error = this.#error.toJson();

    if (!isObject(error) || isArray(error)) {
      throw new Error("Expecting 'error' to be an object (and not an array)");
    }

    const detail = { ...error };
    detail["@type"] = `type.googleapis.com/${this.#error.getType().typeName}`;

    return new reboot_api.Status({
      code: this.code,
      message: this.#message,
      details: [detail]
    });
  }

  constructor(
    error: OpsTicketShowBrainSourcesAbortedError | z.infer<typeof reboot_api.ZOD_ERRORS>,
    { message }: { message?: string } = {}
  ) {
    super();

    // Set the name of this error for even more information!
    this.name = this.constructor.name;

    if (error instanceof protobuf_es.Message) {
      this.#error = error;
    } else if (!("type" in error)) {
      throw new Error("Expecting discriminator 'type' in error");
    } else if (reboot_api.ZOD_ERROR_NAMES.includes(error.type)) {
      this.#error = reboot_api.errorFromZodError(error);
    } else {
      throw new Error(`Unknown 'type' discriminator '${error.type}' in error`);
    }

    let code = reboot_api.grpcStatusCodeFromError(this.#error);

    if (code === undefined) {
      // Must be one of the Reboot specific errors.
      code = reboot_api.StatusCode.ABORTED;
    }

    this.code = code;

    this.#message = message;
  }

  toString(): string {
    return `${this.name}: ${this.message}`;
  }

  get message(): string {
    return `${this.#error.getType().typeName}${this.#message ? ": " + this.#message : ""}`;
  }

  get error(): z.infer<typeof reboot_api.ZOD_ERRORS> {
    reboot_api.assert(this.#error instanceof protobuf_es.Message);
    // Non-declared errors (e.g., gRPC errors).
    return reboot_api.zodErrorFromError(this.#error);
  }

  readonly #error: OpsTicketShowBrainSourcesAbortedError;
  readonly code: reboot_api.StatusCode;
  readonly #message?: string;
}


export interface UseOpsTicketApi {
  mutators: OpsTicketMutators;
  idempotently: (args: { key: string }) => OpsTicketIdempotently;
  create: {
    // Mutators are functions and can be called directly.
    (partialRequest?: OpsTicket.PartialCreateRequest,
     options?: { metadata?: any, idempotencyKey?: string }
    ): Promise<
      reboot_web.ResponseOrAborted<
        OpsTicket.CreateResponse,
        OpsTicketCreateAborted
      >>;

    pending: PendingOpsTicketCreateMutation[];
  };
  triage: {
    // Mutators are functions and can be called directly.
    (partialRequest?: OpsTicket.PartialTriageRequest,
     options?: { metadata?: any, idempotencyKey?: string }
    ): Promise<
      reboot_web.ResponseOrAborted<
        OpsTicket.TriageResponse,
        OpsTicketTriageAborted
      >>;

    pending: PendingOpsTicketTriageMutation[];
  };
  acknowledgeDispatch: {
    // Mutators are functions and can be called directly.
    (partialRequest?: OpsTicket.PartialAcknowledgeDispatchRequest,
     options?: { metadata?: any, idempotencyKey?: string }
    ): Promise<
      reboot_web.ResponseOrAborted<
        OpsTicket.AcknowledgeDispatchResponse,
        OpsTicketAcknowledgeDispatchAborted
      >>;

    pending: PendingOpsTicketAcknowledgeDispatchMutation[];
  };
  proposeNewRule: {
    // Mutators are functions and can be called directly.
    (partialRequest?: OpsTicket.PartialProposeNewRuleRequest,
     options?: { metadata?: any, idempotencyKey?: string }
    ): Promise<
      reboot_web.ResponseOrAborted<
        OpsTicket.ProposeNewRuleResponse,
        OpsTicketProposeNewRuleAborted
      >>;

    pending: PendingOpsTicketProposeNewRuleMutation[];
  };
  useShowBrainSources(
    partialRequest?: OpsTicket.PartialShowBrainSourcesRequest
  ): {
    response: OpsTicket.ShowBrainSourcesResponse | undefined;
    isLoading: boolean;
    aborted: OpsTicketShowBrainSourcesAborted | undefined;
  };
  useShowBrainSources(
    partialRequest?: OpsTicket.PartialShowBrainSourcesRequest,
    options?: { suspense: true }
  ): {
    response: OpsTicket.ShowBrainSourcesResponse;
    isLoading: boolean;
    aborted: undefined;
  } | {
    response: undefined;
    isLoading: boolean;
    aborted: OpsTicketShowBrainSourcesAborted;
  };
  useShowBrainSources(
    partialRequest?: OpsTicket.PartialShowBrainSourcesRequest,
    options?: { suspense: false }
  ): {
    response: OpsTicket.ShowBrainSourcesResponse | undefined;
    isLoading: boolean;
    aborted: OpsTicketShowBrainSourcesAborted | undefined;
  };
  showBrainSources: (
    partialRequest?: OpsTicket.PartialShowBrainSourcesRequest,
    options?: { signal?: AbortSignal; retry?: boolean }
  ) => Promise<
    reboot_web.ResponseOrAborted<
    OpsTicket.ShowBrainSourcesResponse,
    OpsTicketShowBrainSourcesAborted
    >
  >;
}

export namespace User {
  export type IngestTextMessageRequest =
  z.infer<
    reboot_api.EnsureZodObject<
      typeof api.User.methods.ingestTextMessage.request
      >
    >;

  export type PartialIngestTextMessageRequest =
  IngestTextMessageRequest;

  export type IngestTextMessageResponse =
  z.infer<
    reboot_api.EnsureZodObject<
      typeof api.User.methods.ingestTextMessage.response
      >
    >;

  export type PartialIngestTextMessageResponse =
  IngestTextMessageResponse;
}
export namespace User {
  export type IngestVoiceNoteRequest =
  z.infer<
    reboot_api.EnsureZodObject<
      typeof api.User.methods.ingestVoiceNote.request
      >
    >;

  export type PartialIngestVoiceNoteRequest =
  IngestVoiceNoteRequest;

  export type IngestVoiceNoteResponse =
  z.infer<
    reboot_api.EnsureZodObject<
      typeof api.User.methods.ingestVoiceNote.response
      >
    >;

  export type PartialIngestVoiceNoteResponse =
  IngestVoiceNoteResponse;
}
export namespace User {
  export type ListTicketsRequest =
  z.infer<
    reboot_api.EnsureZodObject<
      typeof api.User.methods.listTickets.request
      >
    >;

  export type PartialListTicketsRequest =
  ListTicketsRequest;

  export type ListTicketsResponse =
  z.infer<
    reboot_api.EnsureZodObject<
      typeof api.User.methods.listTickets.response
      >
    >;

  export type PartialListTicketsResponse =
  ListTicketsResponse;
}
export namespace User {
  export type QueryBrainRequest =
  z.infer<
    reboot_api.EnsureZodObject<
      typeof api.User.methods.queryBrain.request
      >
    >;

  export type PartialQueryBrainRequest =
  QueryBrainRequest;

  export type QueryBrainResponse =
  z.infer<
    reboot_api.EnsureZodObject<
      typeof api.User.methods.queryBrain.response
      >
    >;

  export type PartialQueryBrainResponse =
  QueryBrainResponse;
}
export namespace User {
  export type LiveStateRequest =
  z.infer<
    reboot_api.EnsureZodObject<
      typeof api.User.methods.liveState.request
      >
    >;

  export type PartialLiveStateRequest =
  LiveStateRequest;

  export type LiveStateResponse =
  z.infer<
    reboot_api.EnsureZodObject<
      typeof api.User.methods.liveState.response
      >
    >;

  export type PartialLiveStateResponse =
  LiveStateResponse;
}
export namespace User {
  export type CostSummaryRequest =
  z.infer<
    reboot_api.EnsureZodObject<
      typeof api.User.methods.costSummary.request
      >
    >;

  export type PartialCostSummaryRequest =
  CostSummaryRequest;

  export type CostSummaryResponse =
  z.infer<
    reboot_api.EnsureZodObject<
      typeof api.User.methods.costSummary.response
      >
    >;

  export type PartialCostSummaryResponse =
  CostSummaryResponse;
}
export namespace User {
  export type CreateRequest =
  z.infer<
    reboot_api.EnsureZodObject<
      typeof api.User.methods.create.request
      >
    >;

  export type PartialCreateRequest =
  CreateRequest;

  export type CreateResponse =
  z.infer<
    reboot_api.EnsureZodObject<
      typeof api.User.methods.create.response
      >
    >;

  export type PartialCreateResponse =
  CreateResponse;
}

export interface UserMutators {
  ingestTextMessage: {
    // Mutators are functions and can be called directly.
    (partialRequest?: User.PartialIngestTextMessageRequest,
     options?: { metadata?: any, idempotencyKey?: string }
    ): Promise<
      reboot_web.ResponseOrAborted<
        User.IngestTextMessageResponse,
        UserIngestTextMessageAborted
      >>;

    pending: PendingUserIngestTextMessageMutation[];
  };
  ingestVoiceNote: {
    // Mutators are functions and can be called directly.
    (partialRequest?: User.PartialIngestVoiceNoteRequest,
     options?: { metadata?: any, idempotencyKey?: string }
    ): Promise<
      reboot_web.ResponseOrAborted<
        User.IngestVoiceNoteResponse,
        UserIngestVoiceNoteAborted
      >>;

    pending: PendingUserIngestVoiceNoteMutation[];
  };
  create: {
    // Mutators are functions and can be called directly.
    (partialRequest?: User.PartialCreateRequest,
     options?: { metadata?: any, idempotencyKey?: string }
    ): Promise<
      reboot_web.ResponseOrAborted<
        User.CreateResponse,
        UserCreateAborted
      >>;

    pending: PendingUserCreateMutation[];
  };
}

export interface UserIdempotently {
  ingestTextMessage: {
    // Idempotent calls are functions and can be called directly.
    (partialRequest?: User.PartialIngestTextMessageRequest,
     options?: { metadata?: any }
    ): Promise<
      reboot_web.ResponseOrAborted<
        User.IngestTextMessageResponse,
        UserIngestTextMessageAborted
      >>;

    pending: PendingUserIngestTextMessageMutation[];
  };
  ingestVoiceNote: {
    // Idempotent calls are functions and can be called directly.
    (partialRequest?: User.PartialIngestVoiceNoteRequest,
     options?: { metadata?: any }
    ): Promise<
      reboot_web.ResponseOrAborted<
        User.IngestVoiceNoteResponse,
        UserIngestVoiceNoteAborted
      >>;

    pending: PendingUserIngestVoiceNoteMutation[];
  };
  create: {
    // Idempotent calls are functions and can be called directly.
    (partialRequest?: User.PartialCreateRequest,
     options?: { metadata?: any }
    ): Promise<
      reboot_web.ResponseOrAborted<
        User.CreateResponse,
        UserCreateAborted
      >>;

    pending: PendingUserCreateMutation[];
  };
}



const USER_INGEST_TEXT_MESSAGE_ERROR_TYPES = [
  ...ERROR_TYPES,

  // Method errors.
] as const; // Need `as const` to ensure TypeScript infers this as a tuple!

export type UserIngestTextMessageAbortedError =
  reboot_api.InstanceTypeForErrorTypes<
    typeof USER_INGEST_TEXT_MESSAGE_ERROR_TYPES
  >[number];

export class UserIngestTextMessageAborted extends reboot_api.Aborted {
  static fromStatus(status: reboot_api.Status) {
    let error = reboot_api.errorFromGoogleRpcStatusDetails(
      status,
      USER_INGEST_TEXT_MESSAGE_ERROR_TYPES,
    );

    if (error !== undefined) {
      return new UserIngestTextMessageAborted(
        error, { message: status.message }
      );
    }

    error = reboot_api.errorFromGoogleRpcStatusCode(status);

    // TODO(benh): also consider getting the type names from
    // `status.details` and including that in `message` to make
    // debugging easier.

    return new UserIngestTextMessageAborted(
      error, { message: status.message }
    );
  }

  public toStatus(): reboot_api.Status {
    const isObject = (value: unknown): value is object => {
      return typeof value === 'object';
    };

    const isArray = (value: unknown): value is any[]  => {
      return Array.isArray(value);
    };

    const error = this.#error.toJson();

    if (!isObject(error) || isArray(error)) {
      throw new Error("Expecting 'error' to be an object (and not an array)");
    }

    const detail = { ...error };
    detail["@type"] = `type.googleapis.com/${this.#error.getType().typeName}`;

    return new reboot_api.Status({
      code: this.code,
      message: this.#message,
      details: [detail]
    });
  }

  constructor(
    error: UserIngestTextMessageAbortedError | z.infer<typeof reboot_api.ZOD_ERRORS>,
    { message }: { message?: string } = {}
  ) {
    super();

    // Set the name of this error for even more information!
    this.name = this.constructor.name;

    if (error instanceof protobuf_es.Message) {
      this.#error = error;
    } else if (!("type" in error)) {
      throw new Error("Expecting discriminator 'type' in error");
    } else if (reboot_api.ZOD_ERROR_NAMES.includes(error.type)) {
      this.#error = reboot_api.errorFromZodError(error);
    } else {
      throw new Error(`Unknown 'type' discriminator '${error.type}' in error`);
    }

    let code = reboot_api.grpcStatusCodeFromError(this.#error);

    if (code === undefined) {
      // Must be one of the Reboot specific errors.
      code = reboot_api.StatusCode.ABORTED;
    }

    this.code = code;

    this.#message = message;
  }

  toString(): string {
    return `${this.name}: ${this.message}`;
  }

  get message(): string {
    return `${this.#error.getType().typeName}${this.#message ? ": " + this.#message : ""}`;
  }

  get error(): z.infer<typeof reboot_api.ZOD_ERRORS> {
    reboot_api.assert(this.#error instanceof protobuf_es.Message);
    // Non-declared errors (e.g., gRPC errors).
    return reboot_api.zodErrorFromError(this.#error);
  }

  readonly #error: UserIngestTextMessageAbortedError;
  readonly code: reboot_api.StatusCode;
  readonly #message?: string;
}



const USER_INGEST_VOICE_NOTE_ERROR_TYPES = [
  ...ERROR_TYPES,

  // Method errors.
] as const; // Need `as const` to ensure TypeScript infers this as a tuple!

export type UserIngestVoiceNoteAbortedError =
  reboot_api.InstanceTypeForErrorTypes<
    typeof USER_INGEST_VOICE_NOTE_ERROR_TYPES
  >[number];

export class UserIngestVoiceNoteAborted extends reboot_api.Aborted {
  static fromStatus(status: reboot_api.Status) {
    let error = reboot_api.errorFromGoogleRpcStatusDetails(
      status,
      USER_INGEST_VOICE_NOTE_ERROR_TYPES,
    );

    if (error !== undefined) {
      return new UserIngestVoiceNoteAborted(
        error, { message: status.message }
      );
    }

    error = reboot_api.errorFromGoogleRpcStatusCode(status);

    // TODO(benh): also consider getting the type names from
    // `status.details` and including that in `message` to make
    // debugging easier.

    return new UserIngestVoiceNoteAborted(
      error, { message: status.message }
    );
  }

  public toStatus(): reboot_api.Status {
    const isObject = (value: unknown): value is object => {
      return typeof value === 'object';
    };

    const isArray = (value: unknown): value is any[]  => {
      return Array.isArray(value);
    };

    const error = this.#error.toJson();

    if (!isObject(error) || isArray(error)) {
      throw new Error("Expecting 'error' to be an object (and not an array)");
    }

    const detail = { ...error };
    detail["@type"] = `type.googleapis.com/${this.#error.getType().typeName}`;

    return new reboot_api.Status({
      code: this.code,
      message: this.#message,
      details: [detail]
    });
  }

  constructor(
    error: UserIngestVoiceNoteAbortedError | z.infer<typeof reboot_api.ZOD_ERRORS>,
    { message }: { message?: string } = {}
  ) {
    super();

    // Set the name of this error for even more information!
    this.name = this.constructor.name;

    if (error instanceof protobuf_es.Message) {
      this.#error = error;
    } else if (!("type" in error)) {
      throw new Error("Expecting discriminator 'type' in error");
    } else if (reboot_api.ZOD_ERROR_NAMES.includes(error.type)) {
      this.#error = reboot_api.errorFromZodError(error);
    } else {
      throw new Error(`Unknown 'type' discriminator '${error.type}' in error`);
    }

    let code = reboot_api.grpcStatusCodeFromError(this.#error);

    if (code === undefined) {
      // Must be one of the Reboot specific errors.
      code = reboot_api.StatusCode.ABORTED;
    }

    this.code = code;

    this.#message = message;
  }

  toString(): string {
    return `${this.name}: ${this.message}`;
  }

  get message(): string {
    return `${this.#error.getType().typeName}${this.#message ? ": " + this.#message : ""}`;
  }

  get error(): z.infer<typeof reboot_api.ZOD_ERRORS> {
    reboot_api.assert(this.#error instanceof protobuf_es.Message);
    // Non-declared errors (e.g., gRPC errors).
    return reboot_api.zodErrorFromError(this.#error);
  }

  readonly #error: UserIngestVoiceNoteAbortedError;
  readonly code: reboot_api.StatusCode;
  readonly #message?: string;
}



const USER_LIST_TICKETS_ERROR_TYPES = [
  ...ERROR_TYPES,

  // Method errors.
] as const; // Need `as const` to ensure TypeScript infers this as a tuple!

export type UserListTicketsAbortedError =
  reboot_api.InstanceTypeForErrorTypes<
    typeof USER_LIST_TICKETS_ERROR_TYPES
  >[number];

export class UserListTicketsAborted extends reboot_api.Aborted {
  static fromStatus(status: reboot_api.Status) {
    let error = reboot_api.errorFromGoogleRpcStatusDetails(
      status,
      USER_LIST_TICKETS_ERROR_TYPES,
    );

    if (error !== undefined) {
      return new UserListTicketsAborted(
        error, { message: status.message }
      );
    }

    error = reboot_api.errorFromGoogleRpcStatusCode(status);

    // TODO(benh): also consider getting the type names from
    // `status.details` and including that in `message` to make
    // debugging easier.

    return new UserListTicketsAborted(
      error, { message: status.message }
    );
  }

  public toStatus(): reboot_api.Status {
    const isObject = (value: unknown): value is object => {
      return typeof value === 'object';
    };

    const isArray = (value: unknown): value is any[]  => {
      return Array.isArray(value);
    };

    const error = this.#error.toJson();

    if (!isObject(error) || isArray(error)) {
      throw new Error("Expecting 'error' to be an object (and not an array)");
    }

    const detail = { ...error };
    detail["@type"] = `type.googleapis.com/${this.#error.getType().typeName}`;

    return new reboot_api.Status({
      code: this.code,
      message: this.#message,
      details: [detail]
    });
  }

  constructor(
    error: UserListTicketsAbortedError | z.infer<typeof reboot_api.ZOD_ERRORS>,
    { message }: { message?: string } = {}
  ) {
    super();

    // Set the name of this error for even more information!
    this.name = this.constructor.name;

    if (error instanceof protobuf_es.Message) {
      this.#error = error;
    } else if (!("type" in error)) {
      throw new Error("Expecting discriminator 'type' in error");
    } else if (reboot_api.ZOD_ERROR_NAMES.includes(error.type)) {
      this.#error = reboot_api.errorFromZodError(error);
    } else {
      throw new Error(`Unknown 'type' discriminator '${error.type}' in error`);
    }

    let code = reboot_api.grpcStatusCodeFromError(this.#error);

    if (code === undefined) {
      // Must be one of the Reboot specific errors.
      code = reboot_api.StatusCode.ABORTED;
    }

    this.code = code;

    this.#message = message;
  }

  toString(): string {
    return `${this.name}: ${this.message}`;
  }

  get message(): string {
    return `${this.#error.getType().typeName}${this.#message ? ": " + this.#message : ""}`;
  }

  get error(): z.infer<typeof reboot_api.ZOD_ERRORS> {
    reboot_api.assert(this.#error instanceof protobuf_es.Message);
    // Non-declared errors (e.g., gRPC errors).
    return reboot_api.zodErrorFromError(this.#error);
  }

  readonly #error: UserListTicketsAbortedError;
  readonly code: reboot_api.StatusCode;
  readonly #message?: string;
}



const USER_QUERY_BRAIN_ERROR_TYPES = [
  ...ERROR_TYPES,

  // Method errors.
] as const; // Need `as const` to ensure TypeScript infers this as a tuple!

export type UserQueryBrainAbortedError =
  reboot_api.InstanceTypeForErrorTypes<
    typeof USER_QUERY_BRAIN_ERROR_TYPES
  >[number];

export class UserQueryBrainAborted extends reboot_api.Aborted {
  static fromStatus(status: reboot_api.Status) {
    let error = reboot_api.errorFromGoogleRpcStatusDetails(
      status,
      USER_QUERY_BRAIN_ERROR_TYPES,
    );

    if (error !== undefined) {
      return new UserQueryBrainAborted(
        error, { message: status.message }
      );
    }

    error = reboot_api.errorFromGoogleRpcStatusCode(status);

    // TODO(benh): also consider getting the type names from
    // `status.details` and including that in `message` to make
    // debugging easier.

    return new UserQueryBrainAborted(
      error, { message: status.message }
    );
  }

  public toStatus(): reboot_api.Status {
    const isObject = (value: unknown): value is object => {
      return typeof value === 'object';
    };

    const isArray = (value: unknown): value is any[]  => {
      return Array.isArray(value);
    };

    const error = this.#error.toJson();

    if (!isObject(error) || isArray(error)) {
      throw new Error("Expecting 'error' to be an object (and not an array)");
    }

    const detail = { ...error };
    detail["@type"] = `type.googleapis.com/${this.#error.getType().typeName}`;

    return new reboot_api.Status({
      code: this.code,
      message: this.#message,
      details: [detail]
    });
  }

  constructor(
    error: UserQueryBrainAbortedError | z.infer<typeof reboot_api.ZOD_ERRORS>,
    { message }: { message?: string } = {}
  ) {
    super();

    // Set the name of this error for even more information!
    this.name = this.constructor.name;

    if (error instanceof protobuf_es.Message) {
      this.#error = error;
    } else if (!("type" in error)) {
      throw new Error("Expecting discriminator 'type' in error");
    } else if (reboot_api.ZOD_ERROR_NAMES.includes(error.type)) {
      this.#error = reboot_api.errorFromZodError(error);
    } else {
      throw new Error(`Unknown 'type' discriminator '${error.type}' in error`);
    }

    let code = reboot_api.grpcStatusCodeFromError(this.#error);

    if (code === undefined) {
      // Must be one of the Reboot specific errors.
      code = reboot_api.StatusCode.ABORTED;
    }

    this.code = code;

    this.#message = message;
  }

  toString(): string {
    return `${this.name}: ${this.message}`;
  }

  get message(): string {
    return `${this.#error.getType().typeName}${this.#message ? ": " + this.#message : ""}`;
  }

  get error(): z.infer<typeof reboot_api.ZOD_ERRORS> {
    reboot_api.assert(this.#error instanceof protobuf_es.Message);
    // Non-declared errors (e.g., gRPC errors).
    return reboot_api.zodErrorFromError(this.#error);
  }

  readonly #error: UserQueryBrainAbortedError;
  readonly code: reboot_api.StatusCode;
  readonly #message?: string;
}



const USER_LIVE_STATE_ERROR_TYPES = [
  ...ERROR_TYPES,

  // Method errors.
] as const; // Need `as const` to ensure TypeScript infers this as a tuple!

export type UserLiveStateAbortedError =
  reboot_api.InstanceTypeForErrorTypes<
    typeof USER_LIVE_STATE_ERROR_TYPES
  >[number];

export class UserLiveStateAborted extends reboot_api.Aborted {
  static fromStatus(status: reboot_api.Status) {
    let error = reboot_api.errorFromGoogleRpcStatusDetails(
      status,
      USER_LIVE_STATE_ERROR_TYPES,
    );

    if (error !== undefined) {
      return new UserLiveStateAborted(
        error, { message: status.message }
      );
    }

    error = reboot_api.errorFromGoogleRpcStatusCode(status);

    // TODO(benh): also consider getting the type names from
    // `status.details` and including that in `message` to make
    // debugging easier.

    return new UserLiveStateAborted(
      error, { message: status.message }
    );
  }

  public toStatus(): reboot_api.Status {
    const isObject = (value: unknown): value is object => {
      return typeof value === 'object';
    };

    const isArray = (value: unknown): value is any[]  => {
      return Array.isArray(value);
    };

    const error = this.#error.toJson();

    if (!isObject(error) || isArray(error)) {
      throw new Error("Expecting 'error' to be an object (and not an array)");
    }

    const detail = { ...error };
    detail["@type"] = `type.googleapis.com/${this.#error.getType().typeName}`;

    return new reboot_api.Status({
      code: this.code,
      message: this.#message,
      details: [detail]
    });
  }

  constructor(
    error: UserLiveStateAbortedError | z.infer<typeof reboot_api.ZOD_ERRORS>,
    { message }: { message?: string } = {}
  ) {
    super();

    // Set the name of this error for even more information!
    this.name = this.constructor.name;

    if (error instanceof protobuf_es.Message) {
      this.#error = error;
    } else if (!("type" in error)) {
      throw new Error("Expecting discriminator 'type' in error");
    } else if (reboot_api.ZOD_ERROR_NAMES.includes(error.type)) {
      this.#error = reboot_api.errorFromZodError(error);
    } else {
      throw new Error(`Unknown 'type' discriminator '${error.type}' in error`);
    }

    let code = reboot_api.grpcStatusCodeFromError(this.#error);

    if (code === undefined) {
      // Must be one of the Reboot specific errors.
      code = reboot_api.StatusCode.ABORTED;
    }

    this.code = code;

    this.#message = message;
  }

  toString(): string {
    return `${this.name}: ${this.message}`;
  }

  get message(): string {
    return `${this.#error.getType().typeName}${this.#message ? ": " + this.#message : ""}`;
  }

  get error(): z.infer<typeof reboot_api.ZOD_ERRORS> {
    reboot_api.assert(this.#error instanceof protobuf_es.Message);
    // Non-declared errors (e.g., gRPC errors).
    return reboot_api.zodErrorFromError(this.#error);
  }

  readonly #error: UserLiveStateAbortedError;
  readonly code: reboot_api.StatusCode;
  readonly #message?: string;
}



const USER_COST_SUMMARY_ERROR_TYPES = [
  ...ERROR_TYPES,

  // Method errors.
] as const; // Need `as const` to ensure TypeScript infers this as a tuple!

export type UserCostSummaryAbortedError =
  reboot_api.InstanceTypeForErrorTypes<
    typeof USER_COST_SUMMARY_ERROR_TYPES
  >[number];

export class UserCostSummaryAborted extends reboot_api.Aborted {
  static fromStatus(status: reboot_api.Status) {
    let error = reboot_api.errorFromGoogleRpcStatusDetails(
      status,
      USER_COST_SUMMARY_ERROR_TYPES,
    );

    if (error !== undefined) {
      return new UserCostSummaryAborted(
        error, { message: status.message }
      );
    }

    error = reboot_api.errorFromGoogleRpcStatusCode(status);

    // TODO(benh): also consider getting the type names from
    // `status.details` and including that in `message` to make
    // debugging easier.

    return new UserCostSummaryAborted(
      error, { message: status.message }
    );
  }

  public toStatus(): reboot_api.Status {
    const isObject = (value: unknown): value is object => {
      return typeof value === 'object';
    };

    const isArray = (value: unknown): value is any[]  => {
      return Array.isArray(value);
    };

    const error = this.#error.toJson();

    if (!isObject(error) || isArray(error)) {
      throw new Error("Expecting 'error' to be an object (and not an array)");
    }

    const detail = { ...error };
    detail["@type"] = `type.googleapis.com/${this.#error.getType().typeName}`;

    return new reboot_api.Status({
      code: this.code,
      message: this.#message,
      details: [detail]
    });
  }

  constructor(
    error: UserCostSummaryAbortedError | z.infer<typeof reboot_api.ZOD_ERRORS>,
    { message }: { message?: string } = {}
  ) {
    super();

    // Set the name of this error for even more information!
    this.name = this.constructor.name;

    if (error instanceof protobuf_es.Message) {
      this.#error = error;
    } else if (!("type" in error)) {
      throw new Error("Expecting discriminator 'type' in error");
    } else if (reboot_api.ZOD_ERROR_NAMES.includes(error.type)) {
      this.#error = reboot_api.errorFromZodError(error);
    } else {
      throw new Error(`Unknown 'type' discriminator '${error.type}' in error`);
    }

    let code = reboot_api.grpcStatusCodeFromError(this.#error);

    if (code === undefined) {
      // Must be one of the Reboot specific errors.
      code = reboot_api.StatusCode.ABORTED;
    }

    this.code = code;

    this.#message = message;
  }

  toString(): string {
    return `${this.name}: ${this.message}`;
  }

  get message(): string {
    return `${this.#error.getType().typeName}${this.#message ? ": " + this.#message : ""}`;
  }

  get error(): z.infer<typeof reboot_api.ZOD_ERRORS> {
    reboot_api.assert(this.#error instanceof protobuf_es.Message);
    // Non-declared errors (e.g., gRPC errors).
    return reboot_api.zodErrorFromError(this.#error);
  }

  readonly #error: UserCostSummaryAbortedError;
  readonly code: reboot_api.StatusCode;
  readonly #message?: string;
}



const USER_CREATE_ERROR_TYPES = [
  ...ERROR_TYPES,

  // Method errors.
] as const; // Need `as const` to ensure TypeScript infers this as a tuple!

export type UserCreateAbortedError =
  reboot_api.InstanceTypeForErrorTypes<
    typeof USER_CREATE_ERROR_TYPES
  >[number];

export class UserCreateAborted extends reboot_api.Aborted {
  static fromStatus(status: reboot_api.Status) {
    let error = reboot_api.errorFromGoogleRpcStatusDetails(
      status,
      USER_CREATE_ERROR_TYPES,
    );

    if (error !== undefined) {
      return new UserCreateAborted(
        error, { message: status.message }
      );
    }

    error = reboot_api.errorFromGoogleRpcStatusCode(status);

    // TODO(benh): also consider getting the type names from
    // `status.details` and including that in `message` to make
    // debugging easier.

    return new UserCreateAborted(
      error, { message: status.message }
    );
  }

  public toStatus(): reboot_api.Status {
    const isObject = (value: unknown): value is object => {
      return typeof value === 'object';
    };

    const isArray = (value: unknown): value is any[]  => {
      return Array.isArray(value);
    };

    const error = this.#error.toJson();

    if (!isObject(error) || isArray(error)) {
      throw new Error("Expecting 'error' to be an object (and not an array)");
    }

    const detail = { ...error };
    detail["@type"] = `type.googleapis.com/${this.#error.getType().typeName}`;

    return new reboot_api.Status({
      code: this.code,
      message: this.#message,
      details: [detail]
    });
  }

  constructor(
    error: UserCreateAbortedError | z.infer<typeof reboot_api.ZOD_ERRORS>,
    { message }: { message?: string } = {}
  ) {
    super();

    // Set the name of this error for even more information!
    this.name = this.constructor.name;

    if (error instanceof protobuf_es.Message) {
      this.#error = error;
    } else if (!("type" in error)) {
      throw new Error("Expecting discriminator 'type' in error");
    } else if (reboot_api.ZOD_ERROR_NAMES.includes(error.type)) {
      this.#error = reboot_api.errorFromZodError(error);
    } else {
      throw new Error(`Unknown 'type' discriminator '${error.type}' in error`);
    }

    let code = reboot_api.grpcStatusCodeFromError(this.#error);

    if (code === undefined) {
      // Must be one of the Reboot specific errors.
      code = reboot_api.StatusCode.ABORTED;
    }

    this.code = code;

    this.#message = message;
  }

  toString(): string {
    return `${this.name}: ${this.message}`;
  }

  get message(): string {
    return `${this.#error.getType().typeName}${this.#message ? ": " + this.#message : ""}`;
  }

  get error(): z.infer<typeof reboot_api.ZOD_ERRORS> {
    reboot_api.assert(this.#error instanceof protobuf_es.Message);
    // Non-declared errors (e.g., gRPC errors).
    return reboot_api.zodErrorFromError(this.#error);
  }

  readonly #error: UserCreateAbortedError;
  readonly code: reboot_api.StatusCode;
  readonly #message?: string;
}


export interface UseUserApi {
  mutators: UserMutators;
  idempotently: (args: { key: string }) => UserIdempotently;
  ingestTextMessage: {
    // Mutators are functions and can be called directly.
    (partialRequest?: User.PartialIngestTextMessageRequest,
     options?: { metadata?: any, idempotencyKey?: string }
    ): Promise<
      reboot_web.ResponseOrAborted<
        User.IngestTextMessageResponse,
        UserIngestTextMessageAborted
      >>;

    pending: PendingUserIngestTextMessageMutation[];
  };
  ingestVoiceNote: {
    // Mutators are functions and can be called directly.
    (partialRequest?: User.PartialIngestVoiceNoteRequest,
     options?: { metadata?: any, idempotencyKey?: string }
    ): Promise<
      reboot_web.ResponseOrAborted<
        User.IngestVoiceNoteResponse,
        UserIngestVoiceNoteAborted
      >>;

    pending: PendingUserIngestVoiceNoteMutation[];
  };
  useListTickets(
    partialRequest?: User.PartialListTicketsRequest
  ): {
    response: User.ListTicketsResponse | undefined;
    isLoading: boolean;
    aborted: UserListTicketsAborted | undefined;
  };
  useListTickets(
    partialRequest?: User.PartialListTicketsRequest,
    options?: { suspense: true }
  ): {
    response: User.ListTicketsResponse;
    isLoading: boolean;
    aborted: undefined;
  } | {
    response: undefined;
    isLoading: boolean;
    aborted: UserListTicketsAborted;
  };
  useListTickets(
    partialRequest?: User.PartialListTicketsRequest,
    options?: { suspense: false }
  ): {
    response: User.ListTicketsResponse | undefined;
    isLoading: boolean;
    aborted: UserListTicketsAborted | undefined;
  };
  listTickets: (
    partialRequest?: User.PartialListTicketsRequest,
    options?: { signal?: AbortSignal; retry?: boolean }
  ) => Promise<
    reboot_web.ResponseOrAborted<
    User.ListTicketsResponse,
    UserListTicketsAborted
    >
  >;
  useQueryBrain(
    partialRequest?: User.PartialQueryBrainRequest
  ): {
    response: User.QueryBrainResponse | undefined;
    isLoading: boolean;
    aborted: UserQueryBrainAborted | undefined;
  };
  useQueryBrain(
    partialRequest?: User.PartialQueryBrainRequest,
    options?: { suspense: true }
  ): {
    response: User.QueryBrainResponse;
    isLoading: boolean;
    aborted: undefined;
  } | {
    response: undefined;
    isLoading: boolean;
    aborted: UserQueryBrainAborted;
  };
  useQueryBrain(
    partialRequest?: User.PartialQueryBrainRequest,
    options?: { suspense: false }
  ): {
    response: User.QueryBrainResponse | undefined;
    isLoading: boolean;
    aborted: UserQueryBrainAborted | undefined;
  };
  queryBrain: (
    partialRequest?: User.PartialQueryBrainRequest,
    options?: { signal?: AbortSignal; retry?: boolean }
  ) => Promise<
    reboot_web.ResponseOrAborted<
    User.QueryBrainResponse,
    UserQueryBrainAborted
    >
  >;
  useLiveState(
    partialRequest?: User.PartialLiveStateRequest
  ): {
    response: User.LiveStateResponse | undefined;
    isLoading: boolean;
    aborted: UserLiveStateAborted | undefined;
  };
  useLiveState(
    partialRequest?: User.PartialLiveStateRequest,
    options?: { suspense: true }
  ): {
    response: User.LiveStateResponse;
    isLoading: boolean;
    aborted: undefined;
  } | {
    response: undefined;
    isLoading: boolean;
    aborted: UserLiveStateAborted;
  };
  useLiveState(
    partialRequest?: User.PartialLiveStateRequest,
    options?: { suspense: false }
  ): {
    response: User.LiveStateResponse | undefined;
    isLoading: boolean;
    aborted: UserLiveStateAborted | undefined;
  };
  liveState: (
    partialRequest?: User.PartialLiveStateRequest,
    options?: { signal?: AbortSignal; retry?: boolean }
  ) => Promise<
    reboot_web.ResponseOrAborted<
    User.LiveStateResponse,
    UserLiveStateAborted
    >
  >;
  useCostSummary(
    partialRequest?: User.PartialCostSummaryRequest
  ): {
    response: User.CostSummaryResponse | undefined;
    isLoading: boolean;
    aborted: UserCostSummaryAborted | undefined;
  };
  useCostSummary(
    partialRequest?: User.PartialCostSummaryRequest,
    options?: { suspense: true }
  ): {
    response: User.CostSummaryResponse;
    isLoading: boolean;
    aborted: undefined;
  } | {
    response: undefined;
    isLoading: boolean;
    aborted: UserCostSummaryAborted;
  };
  useCostSummary(
    partialRequest?: User.PartialCostSummaryRequest,
    options?: { suspense: false }
  ): {
    response: User.CostSummaryResponse | undefined;
    isLoading: boolean;
    aborted: UserCostSummaryAborted | undefined;
  };
  costSummary: (
    partialRequest?: User.PartialCostSummaryRequest,
    options?: { signal?: AbortSignal; retry?: boolean }
  ) => Promise<
    reboot_web.ResponseOrAborted<
    User.CostSummaryResponse,
    UserCostSummaryAborted
    >
  >;
  create: {
    // Mutators are functions and can be called directly.
    (partialRequest?: User.PartialCreateRequest,
     options?: { metadata?: any, idempotencyKey?: string }
    ): Promise<
      reboot_web.ResponseOrAborted<
        User.CreateResponse,
        UserCreateAborted
      >>;

    pending: PendingUserCreateMutation[];
  };
}

export interface SettingsParams {
  id: string;
  storeMutationsLocallyInNamespace?: string;
}

class OpsTicketInstance {

  constructor(id: string, stateRef: string, url: string) {
    this.id = id;
    this.stateRef = stateRef;
    this.url = url;
    this.refs = 1;

     reboot_web.websockets.connect(this.url, this.stateRef);
    this.initializeWebSocket();
  }

  private ref() {
    this.refs += 1;
    return this.refs;
  }

  private unref() {
    this.refs -= 1;

    if (this.refs === 0 && this.websocket !== undefined) {
      this.websocket.close();
       reboot_web.websockets.disconnect(this.url, this.stateRef);
    }

    return this.refs;
  }

  readonly id: string;
  readonly stateRef: string;
  private url: string;
  private refs: number;
  private observers: reboot_react.Observers = {};
  private loadingReaders = 0;
  private runningMutates: reboot_react.Mutate[] = [];
  private queuedMutates: reboot_react.Mutate[] = [];
  private flushMutates?: reboot_api.Event = undefined;
  private websocket?: WebSocket = undefined;
  private backoff: reboot_api.Backoff = new reboot_api.Backoff();

  private hasRunningMutations() {
    return this.runningMutates.length > 0;
  }

  private async flushMutations() {
    if (this.flushMutates === undefined) {
      this.flushMutates = new reboot_api.Event();
    }
    await this.flushMutates.wait();
  }

  private readersLoadedOrFailed() {
    this.flushMutates = undefined;

    if (this.queuedMutates.length > 0) {
      this.runningMutates = this.queuedMutates;
      this.queuedMutates = [];

      if (this.websocket?.readyState === WebSocket.OPEN) {
        for (const { request, update } of this.runningMutates) {
          update({ isLoading: true });
          try {
            this.websocket.send(request.toBinary());
          } catch {
            // We'll retry since we've stored in `*Mutates`.
          }
        }
      }
    }
  }

  private initializeWebSocket() {
    if (this.websocket === undefined && this.refs > 0) {
      const url = new URL(`${this.url}/__/reboot/rpc/${this.stateRef}`);
      url.protocol = url.protocol === "https:" ? "wss:" : "ws:";

      this.websocket = reboot_web.websockets.create(url);

      this.websocket.binaryType = "arraybuffer";

      this.websocket.onopen = () => {
        if (this.websocket?.readyState === WebSocket.OPEN) {
          for (const { request, update } of this.runningMutates) {
            update({ isLoading: true });
            try {
              this.websocket.send(request.toBinary());
            } catch {
              // We'll retry since we've stored in `*Mutates`.
            }
          }
        }
      };

      this.websocket.onerror = async () => {
        if (this.websocket !== undefined) {
          this.websocket = undefined;

          for (const { update } of this.runningMutates) {
            update({ isLoading: false, error: "WebSocket disconnected" });
          }

          if (this.refs > 0) {
            if (this.runningMutates.length > 0) {
              console.warn(
                `[Reboot] WebSocket disconnected, ${this.runningMutates.length} outstanding mutations will be retried when we reconnect`
              );
            }

            await this.backoff.wait();

            this.initializeWebSocket();
          }
        }
      };

      this.websocket.onclose = async () => {
        if (this.websocket !== undefined) {
          this.websocket = undefined;

          for (const { update } of this.runningMutates) {
            update({ isLoading: false, error: "WebSocket disconnected" });
          }

          if (this.refs > 0) {
            await this.backoff.wait();

            this.initializeWebSocket();
          }
        }
      };

      this.websocket.onmessage = async (event) => {
        const { resolve } = this.runningMutates[0];
        this.runningMutates.shift();

        const response = reboot_api.react_pb.MutateResponse.fromBinary(
          new Uint8Array(event.data)
        );

        resolve(response);

        if (
          this.flushMutates !== undefined &&
          this.runningMutates.length === 0
        ) {
          this.flushMutates.set();
        }
      };
    }
  }

  private async mutate(
    partialRequest: protobuf_es.PartialMessage<reboot_api.react_pb.MutateRequest>,
    update: (props: { isLoading: boolean; error?: any }) => void
  ): Promise<reboot_api.react_pb.MutateResponse> {
    const request = partialRequest instanceof reboot_api.react_pb.MutateRequest
      ? partialRequest
      : new reboot_api.react_pb.MutateRequest(partialRequest);

    return new Promise((resolve, _) => {
      if (this.loadingReaders === 0) {
        this.runningMutates = this.runningMutates.concat({ request, resolve, update });
        if (this.websocket?.readyState === WebSocket.OPEN) {
          update({ isLoading: true });
          try {
            this.websocket.send(request.toBinary());
          } catch {
            // We'll retry since we've stored in `*Mutates`.
          }
        }
      } else {
        this.queuedMutates = this.queuedMutates.concat({ request, resolve, update });
      }
    });
  }

  private async read<
    RequestType extends protobuf_es.Message<RequestType>,
    ResponseType extends protobuf_es.Message<ResponseType>,
    >(
    method: string,
    serializedRequest: Uint8Array,
    bearerToken: string | undefined,
    responseType: protobuf_es.MessageType<ResponseType>,
    reader: reboot_react.Reader<ResponseType>
  ) {
    const queryRequest = new reboot_api.react_pb.QueryRequest({
      method,
      request: serializedRequest,
      ...(bearerToken !== undefined && { bearerToken } || {}),
    });

    // Expected idempotency key we should observe due to a mutation.
    interface Expected {
      // Idempotency key of mutation.
      idempotencyKey: string;

      // Callback when we've observed this idempotency key.
      observed: (callback: () => void) => Promise<void>;

      // Callback when we no longer care about observing.
      aborted: () => void;
    }

    let expecteds: Expected[] = [];

    // When we disconnect we may not be able to observe
    // responses due to mutations yet there may still be
    // some outstanding responses that are expected which
    // we treat as "orphans" in the sense that we won't
    // observe their idempotency keys but once we reconnect
    // we will still have observed their effects and can
    // call `observed()` on them.
    let orphans: Expected[] = [];

    const id = `${uuidv4()}`;

    this.observers[id] = {
      observe: (
        idempotencyKey: string,
        observed: (callback: () => void) => Promise<void>,
        aborted: () => void
      ) => {
        expecteds = expecteds.concat({ idempotencyKey, observed, aborted })
      },
      unobserve: (idempotencyKey: string) => {
        expecteds = expecteds.filter(
          expected => expected.idempotencyKey !== idempotencyKey
        );

        orphans = orphans.filter(
          orphan => orphan.idempotencyKey !== idempotencyKey
        );
      }
    };

    try {
      await reboot_api.retryForever(async () => {
        let loaded = false;
        this.loadingReaders += 1;

        // Any mutations started after we've incremented
        // `this.loadingReaders` will be queued until after
        // all the readers have loaded and thus (1) we know all
        // current `expected` are actually `orphans` that
        // we will haved "observed" once we are (re)connected
        // because we flush mutations before starting to read
        // and (2) all queued mutations can stay in `expected`
        // because we will in fact be able to observe them
        // since they won't get sent over the websocket
        // until after we are (re)connected.
        //
        // NOTE: we need to concatenate with `orphans`
        // because we may try to (re)connect multiple times
        // and between each try more mutations may have been
        // made (or queued ones will be moved to running).
        orphans = [...orphans, ...expecteds];
        expecteds = [];

        try {
          // Wait for potentially completed mutations to flush
          // before starting to read so that we read the latest
          // state including those mutations.
          if (this.hasRunningMutations()) {
            await this.flushMutations();
          }

          reader.setIsLoading(true);

          const queryResponses = reboot_web.reactiveReader({
            endpoint: `${this.url}/__/reboot/rpc/${this.stateRef}`,
            request: queryRequest,
            signal: reader.abortController.signal,
          });

          for await (const queryResponse of queryResponses) {
            if (!loaded) {
              if ((this.loadingReaders -= 1) === 0) {
                this.readersLoadedOrFailed();
              }
              loaded = true;
            }

            reader.setIsLoading(false);

            const response = queryResponse.responseOrStatus.case === "response"
              ? responseType.fromBinary(queryResponse.responseOrStatus.value)
              : undefined;

            // If we were disconnected it must be that we've
            // observed all `orphans` because we waited
            // for any mutations to flush before we re-started to
            // read.
            const haveOrphans = orphans.length;
            if (haveOrphans > 0) {
              // We mark all mutations as observed except the
              // last one which we also invoke all `setResponse`s.
              // In this way we effectively create a barrier
              // for all readers that will synchronize on the last
              // mutation, but note that this still may lead
              // to some partial state/response updates because
              // one reader may have actually received a response
              // while another reader got disconnected. While this
              // is likely very rare, it is possible. Mitigating
              // this issue is non-trivial and for now we have
              // no plans to address it.
              for (let i = 0; i < orphans.length - 1; i++) {
                orphans[i].observed(() => {});
              }
              await orphans[orphans.length - 1].observed(() => {
                if (response !== undefined) {
                  reader.setResponse(response);
                }
              });

              orphans = [];
            }
            // We want to check the orphans list AND the expecteds list because
            // it could be possible that we receive a query response that
            // contains an idempotency key that we are expecting while having an
            // orphans list with a length greater than 0. In this case, we don't
            // want to skip checking the expecteds list just because we have
            // already checked the orphans list.
            if (
              expecteds.length > 0 &&
              queryResponse.idempotencyKeys.includes(
                expecteds[0].idempotencyKey
              )
            ) {
              await expecteds[0].observed(() => {
                if (response !== undefined) {
                  reader.setResponse(response);
                }
                expecteds.shift();
              });
            }
            // If we don't have any orphans to observe and we don't have any expecteds to observe,
	          // or at least, the first expecteds _is not observed_ by this response, then go ahead and
	          // pass on the response because it might contain new data that should get shown to the
	          // user (e.g., in a chat app this could be a new chat message from a different user).
            else if (response !== undefined && !haveOrphans) {
              reader.setResponse(response);
            }
          }

          throw new Error('Not expecting stream to ever be done');
        } catch (e: unknown) {
          if (!loaded) {
            if ((this.loadingReaders -= 1) === 0) {
              this.readersLoadedOrFailed();
            }
          }

          loaded = false;

          if (reader.abortController.signal.aborted) {
            for (const { aborted } of [...orphans, ...expecteds]) {
              aborted();
            }
            return;
          }

          reader.setIsLoading(false);

          if (e instanceof reboot_api.Status) {
            reader.setStatus(e);
          } else {
            console.warn(
              `[Reboot] Caught unknown exception: ${e instanceof Error ? e.message : JSON.stringify(e)}`
            );
          }

          throw e; // This just retries!
        }
      });
    } finally {
      delete this.observers[id];
    }
  }


  private useCreateMutations: (
    PendingOpsTicketCreateMutation)[] = [];

  private useCreateSetPendings: {
    [id: string]: (mutations: PendingOpsTicketCreateMutation[]) => void
  } = {};

  async create(
    mutation: PendingOpsTicketCreateMutation
  ): Promise<
    reboot_web.ResponseOrAborted<
      OpsTicket.CreateResponse,
      OpsTicketCreateAborted
  >> {
    // We always have at least 1 observer which is this function!
    let remainingObservers = 1;

    const event = new reboot_api.Event();

    let callbacks: (() => void)[] = [];

    const observed = (callback: () => void) => {
      callbacks = callbacks.concat(callback);
      remainingObservers -= 1;
      if (remainingObservers === 0) {
        for (const callback of callbacks) {
          callback();
        }
        event.set();
      }
      return event.wait();
    };

    const aborted = () => {
      observed(() => {});
    }

    // Tell observers about this pending mutation.
    for (const id in this.observers) {
      remainingObservers += 1;
      this.observers[id].observe(mutation.idempotencyKey, observed, aborted);
    }

    this.useCreateMutations = this.useCreateMutations.concat(mutation);

    for (const setPending of Object.values(this.useCreateSetPendings)) {
      setPending(this.useCreateMutations);
    }

    return new Promise<
      reboot_web.ResponseOrAborted<
        OpsTicket.CreateResponse,
        OpsTicketCreateAborted
      >>(
      async (resolve, reject) => {
        const { responseOrStatus } = await this.mutate(
          {
            method: "Create",
            request: mutation.request.toBinary(),
            idempotencyKey: mutation.idempotencyKey,
            bearerToken: mutation.bearerToken,
          },
          ({ isLoading, error }: { isLoading: boolean; error?: any }) => {
            let rerender = false;
            for (const m of this.useCreateMutations) {
              if (m === mutation) {
                if (m.isLoading !== isLoading) {
                  m.isLoading = isLoading;
                  rerender = true;
                }
                if (error !== undefined && m.error !== error) {
                  m.error = error;
                  rerender = true;
                }
              }
            }

            if (rerender) {
              for (const setPending of Object.values(this.useCreateSetPendings)) {
                setPending(this.useCreateMutations);
              }
            }
          }
        );

        const removeMutationsAndSetPending = () => {
          this.useCreateMutations =
            this.useCreateMutations.filter(m => m !== mutation);

          for (const setPending of Object.values(this.useCreateSetPendings)) {
            setPending(this.useCreateMutations);
          }
        }


        switch (responseOrStatus.case) {
          case "response": {
            await observed(() => {
              removeMutationsAndSetPending();
              resolve({
                response:
                  OpsTicketCreateResponseFromProtobufShape(
                    Empty.fromBinary(
                    responseOrStatus.value
                  )
                )
              });
            });
            break;
          }
          case "status": {
            // Let the observers know they no longer should expect to
            // observe this idempotency key.
            for (const id in this.observers) {
              this.observers[id].unobserve(mutation.idempotencyKey);
            }

            const status = reboot_api.Status.fromJsonString(responseOrStatus.value);

            const aborted = OpsTicketCreateAborted.fromStatus(status);

            console.warn(
              `[Reboot] 'OpsTicket.Create' aborted with ${aborted.message}`
            );

            removeMutationsAndSetPending();
            resolve({ aborted });

            break;
          }
          default: {
            // TODO(benh): while this is a _really_ fatal error,
            // should we still set `aborted` instead of throwing?
            reject(new Error('Expecting either a response or a status'));
          }
        }
      });
  }

  useCreate(
    id: string,
    setPending: (mutations: PendingOpsTicketCreateMutation[]) => void
  ) {
    this.useCreateSetPendings[id] = setPending;
  }

  unuseCreate(id: string) {
    delete this.useCreateSetPendings[id];
  }


  private useTriageMutations: (
    PendingOpsTicketTriageMutation)[] = [];

  private useTriageSetPendings: {
    [id: string]: (mutations: PendingOpsTicketTriageMutation[]) => void
  } = {};

  async triage(
    mutation: PendingOpsTicketTriageMutation
  ): Promise<
    reboot_web.ResponseOrAborted<
      OpsTicket.TriageResponse,
      OpsTicketTriageAborted
  >> {
    // We always have at least 1 observer which is this function!
    let remainingObservers = 1;

    const event = new reboot_api.Event();

    let callbacks: (() => void)[] = [];

    const observed = (callback: () => void) => {
      callbacks = callbacks.concat(callback);
      remainingObservers -= 1;
      if (remainingObservers === 0) {
        for (const callback of callbacks) {
          callback();
        }
        event.set();
      }
      return event.wait();
    };

    const aborted = () => {
      observed(() => {});
    }

    // Tell observers about this pending mutation.
    for (const id in this.observers) {
      remainingObservers += 1;
      this.observers[id].observe(mutation.idempotencyKey, observed, aborted);
    }

    this.useTriageMutations = this.useTriageMutations.concat(mutation);

    for (const setPending of Object.values(this.useTriageSetPendings)) {
      setPending(this.useTriageMutations);
    }

    return new Promise<
      reboot_web.ResponseOrAborted<
        OpsTicket.TriageResponse,
        OpsTicketTriageAborted
      >>(
      async (resolve, reject) => {
        const { responseOrStatus } = await this.mutate(
          {
            method: "Triage",
            request: mutation.request.toBinary(),
            idempotencyKey: mutation.idempotencyKey,
            bearerToken: mutation.bearerToken,
          },
          ({ isLoading, error }: { isLoading: boolean; error?: any }) => {
            let rerender = false;
            for (const m of this.useTriageMutations) {
              if (m === mutation) {
                if (m.isLoading !== isLoading) {
                  m.isLoading = isLoading;
                  rerender = true;
                }
                if (error !== undefined && m.error !== error) {
                  m.error = error;
                  rerender = true;
                }
              }
            }

            if (rerender) {
              for (const setPending of Object.values(this.useTriageSetPendings)) {
                setPending(this.useTriageMutations);
              }
            }
          }
        );

        const removeMutationsAndSetPending = () => {
          this.useTriageMutations =
            this.useTriageMutations.filter(m => m !== mutation);

          for (const setPending of Object.values(this.useTriageSetPendings)) {
            setPending(this.useTriageMutations);
          }
        }


        switch (responseOrStatus.case) {
          case "response": {
            await observed(() => {
              removeMutationsAndSetPending();
              resolve({
                response:
                  OpsTicketTriageResponseFromProtobufShape(
                    Empty.fromBinary(
                    responseOrStatus.value
                  )
                )
              });
            });
            break;
          }
          case "status": {
            // Let the observers know they no longer should expect to
            // observe this idempotency key.
            for (const id in this.observers) {
              this.observers[id].unobserve(mutation.idempotencyKey);
            }

            const status = reboot_api.Status.fromJsonString(responseOrStatus.value);

            const aborted = OpsTicketTriageAborted.fromStatus(status);

            console.warn(
              `[Reboot] 'OpsTicket.Triage' aborted with ${aborted.message}`
            );

            removeMutationsAndSetPending();
            resolve({ aborted });

            break;
          }
          default: {
            // TODO(benh): while this is a _really_ fatal error,
            // should we still set `aborted` instead of throwing?
            reject(new Error('Expecting either a response or a status'));
          }
        }
      });
  }

  useTriage(
    id: string,
    setPending: (mutations: PendingOpsTicketTriageMutation[]) => void
  ) {
    this.useTriageSetPendings[id] = setPending;
  }

  unuseTriage(id: string) {
    delete this.useTriageSetPendings[id];
  }


  private useAcknowledgeDispatchMutations: (
    PendingOpsTicketAcknowledgeDispatchMutation)[] = [];

  private useAcknowledgeDispatchSetPendings: {
    [id: string]: (mutations: PendingOpsTicketAcknowledgeDispatchMutation[]) => void
  } = {};

  async acknowledgeDispatch(
    mutation: PendingOpsTicketAcknowledgeDispatchMutation
  ): Promise<
    reboot_web.ResponseOrAborted<
      OpsTicket.AcknowledgeDispatchResponse,
      OpsTicketAcknowledgeDispatchAborted
  >> {
    // We always have at least 1 observer which is this function!
    let remainingObservers = 1;

    const event = new reboot_api.Event();

    let callbacks: (() => void)[] = [];

    const observed = (callback: () => void) => {
      callbacks = callbacks.concat(callback);
      remainingObservers -= 1;
      if (remainingObservers === 0) {
        for (const callback of callbacks) {
          callback();
        }
        event.set();
      }
      return event.wait();
    };

    const aborted = () => {
      observed(() => {});
    }

    // Tell observers about this pending mutation.
    for (const id in this.observers) {
      remainingObservers += 1;
      this.observers[id].observe(mutation.idempotencyKey, observed, aborted);
    }

    this.useAcknowledgeDispatchMutations = this.useAcknowledgeDispatchMutations.concat(mutation);

    for (const setPending of Object.values(this.useAcknowledgeDispatchSetPendings)) {
      setPending(this.useAcknowledgeDispatchMutations);
    }

    return new Promise<
      reboot_web.ResponseOrAborted<
        OpsTicket.AcknowledgeDispatchResponse,
        OpsTicketAcknowledgeDispatchAborted
      >>(
      async (resolve, reject) => {
        const { responseOrStatus } = await this.mutate(
          {
            method: "AcknowledgeDispatch",
            request: mutation.request.toBinary(),
            idempotencyKey: mutation.idempotencyKey,
            bearerToken: mutation.bearerToken,
          },
          ({ isLoading, error }: { isLoading: boolean; error?: any }) => {
            let rerender = false;
            for (const m of this.useAcknowledgeDispatchMutations) {
              if (m === mutation) {
                if (m.isLoading !== isLoading) {
                  m.isLoading = isLoading;
                  rerender = true;
                }
                if (error !== undefined && m.error !== error) {
                  m.error = error;
                  rerender = true;
                }
              }
            }

            if (rerender) {
              for (const setPending of Object.values(this.useAcknowledgeDispatchSetPendings)) {
                setPending(this.useAcknowledgeDispatchMutations);
              }
            }
          }
        );

        const removeMutationsAndSetPending = () => {
          this.useAcknowledgeDispatchMutations =
            this.useAcknowledgeDispatchMutations.filter(m => m !== mutation);

          for (const setPending of Object.values(this.useAcknowledgeDispatchSetPendings)) {
            setPending(this.useAcknowledgeDispatchMutations);
          }
        }


        switch (responseOrStatus.case) {
          case "response": {
            await observed(() => {
              removeMutationsAndSetPending();
              resolve({
                response:
                  OpsTicketAcknowledgeDispatchResponseFromProtobufShape(
                    Empty.fromBinary(
                    responseOrStatus.value
                  )
                )
              });
            });
            break;
          }
          case "status": {
            // Let the observers know they no longer should expect to
            // observe this idempotency key.
            for (const id in this.observers) {
              this.observers[id].unobserve(mutation.idempotencyKey);
            }

            const status = reboot_api.Status.fromJsonString(responseOrStatus.value);

            const aborted = OpsTicketAcknowledgeDispatchAborted.fromStatus(status);

            console.warn(
              `[Reboot] 'OpsTicket.AcknowledgeDispatch' aborted with ${aborted.message}`
            );

            removeMutationsAndSetPending();
            resolve({ aborted });

            break;
          }
          default: {
            // TODO(benh): while this is a _really_ fatal error,
            // should we still set `aborted` instead of throwing?
            reject(new Error('Expecting either a response or a status'));
          }
        }
      });
  }

  useAcknowledgeDispatch(
    id: string,
    setPending: (mutations: PendingOpsTicketAcknowledgeDispatchMutation[]) => void
  ) {
    this.useAcknowledgeDispatchSetPendings[id] = setPending;
  }

  unuseAcknowledgeDispatch(id: string) {
    delete this.useAcknowledgeDispatchSetPendings[id];
  }


  private useProposeNewRuleMutations: (
    PendingOpsTicketProposeNewRuleMutation)[] = [];

  private useProposeNewRuleSetPendings: {
    [id: string]: (mutations: PendingOpsTicketProposeNewRuleMutation[]) => void
  } = {};

  async proposeNewRule(
    mutation: PendingOpsTicketProposeNewRuleMutation
  ): Promise<
    reboot_web.ResponseOrAborted<
      OpsTicket.ProposeNewRuleResponse,
      OpsTicketProposeNewRuleAborted
  >> {
    // We always have at least 1 observer which is this function!
    let remainingObservers = 1;

    const event = new reboot_api.Event();

    let callbacks: (() => void)[] = [];

    const observed = (callback: () => void) => {
      callbacks = callbacks.concat(callback);
      remainingObservers -= 1;
      if (remainingObservers === 0) {
        for (const callback of callbacks) {
          callback();
        }
        event.set();
      }
      return event.wait();
    };

    const aborted = () => {
      observed(() => {});
    }

    // Tell observers about this pending mutation.
    for (const id in this.observers) {
      remainingObservers += 1;
      this.observers[id].observe(mutation.idempotencyKey, observed, aborted);
    }

    this.useProposeNewRuleMutations = this.useProposeNewRuleMutations.concat(mutation);

    for (const setPending of Object.values(this.useProposeNewRuleSetPendings)) {
      setPending(this.useProposeNewRuleMutations);
    }

    return new Promise<
      reboot_web.ResponseOrAborted<
        OpsTicket.ProposeNewRuleResponse,
        OpsTicketProposeNewRuleAborted
      >>(
      async (resolve, reject) => {
        const { responseOrStatus } = await this.mutate(
          {
            method: "ProposeNewRule",
            request: mutation.request.toBinary(),
            idempotencyKey: mutation.idempotencyKey,
            bearerToken: mutation.bearerToken,
          },
          ({ isLoading, error }: { isLoading: boolean; error?: any }) => {
            let rerender = false;
            for (const m of this.useProposeNewRuleMutations) {
              if (m === mutation) {
                if (m.isLoading !== isLoading) {
                  m.isLoading = isLoading;
                  rerender = true;
                }
                if (error !== undefined && m.error !== error) {
                  m.error = error;
                  rerender = true;
                }
              }
            }

            if (rerender) {
              for (const setPending of Object.values(this.useProposeNewRuleSetPendings)) {
                setPending(this.useProposeNewRuleMutations);
              }
            }
          }
        );

        const removeMutationsAndSetPending = () => {
          this.useProposeNewRuleMutations =
            this.useProposeNewRuleMutations.filter(m => m !== mutation);

          for (const setPending of Object.values(this.useProposeNewRuleSetPendings)) {
            setPending(this.useProposeNewRuleMutations);
          }
        }


        switch (responseOrStatus.case) {
          case "response": {
            await observed(() => {
              removeMutationsAndSetPending();
              resolve({
                response:
                  OpsTicketProposeNewRuleResponseFromProtobufShape(
                    loopos_pb.OpsTicketProposeNewRuleResponse.fromBinary(
                    responseOrStatus.value
                  )
                )
              });
            });
            break;
          }
          case "status": {
            // Let the observers know they no longer should expect to
            // observe this idempotency key.
            for (const id in this.observers) {
              this.observers[id].unobserve(mutation.idempotencyKey);
            }

            const status = reboot_api.Status.fromJsonString(responseOrStatus.value);

            const aborted = OpsTicketProposeNewRuleAborted.fromStatus(status);

            console.warn(
              `[Reboot] 'OpsTicket.ProposeNewRule' aborted with ${aborted.message}`
            );

            removeMutationsAndSetPending();
            resolve({ aborted });

            break;
          }
          default: {
            // TODO(benh): while this is a _really_ fatal error,
            // should we still set `aborted` instead of throwing?
            reject(new Error('Expecting either a response or a status'));
          }
        }
      });
  }

  useProposeNewRule(
    id: string,
    setPending: (mutations: PendingOpsTicketProposeNewRuleMutation[]) => void
  ) {
    this.useProposeNewRuleSetPendings[id] = setPending;
  }

  unuseProposeNewRule(id: string) {
    delete this.useProposeNewRuleSetPendings[id];
  }


  private useShowBrainSourcesReaders: {
    [requestBearerTokenHash: string]: reboot_react.Reader<loopos_pb.OpsTicketShowBrainSourcesResponse>
  } = {};

  private showBrainSourcesFinalizationRegistry =
    new FinalizationRegistry((finalize) => finalize());

  startShowBrainSources(
    requestBearerTokenHash: string,
    serializedRequest: Uint8Array,
    bearerToken: string | undefined,
    offlineCacheEnabled: boolean,
    cacheKey: string | null
  ) {
    let reader = this.useShowBrainSourcesReaders[requestBearerTokenHash];

    if (reader === undefined) {
      const event = new reboot_api.Event();

      const promise = event.wait();

      reader = {
        abortController: new AbortController(),
        event,
        promise,
        used: false,
        scheduledUnusedTimeoutsCount: 0,
        setResponses: {},
        setIsLoadings: {},
        setStatuses: {},

        setResponse(
          response: loopos_pb.OpsTicketShowBrainSourcesResponse,
          { cache }: { cache: boolean } = { cache: true }
        ) {
          // Store the response, delete the status.
          this.response = response;
          delete this.status;

          // Trigger response or aborted has been received event (if
          // it wasn't triggered already).
          this.event.set();

          // Dispatch to all listeners.
          for (const setResponse of Object.values(this.setResponses)) {
            setResponse(response);
          }

          // Cache response if applicable.
          if (cache && offlineCacheEnabled) {
            reboot_api.assert(cacheKey !== null);
            const cachedResponse = response.toJsonString();
            reboot_web.offlineCache().set(cacheKey, cachedResponse)
              .catch((error) => {
                console.warn(
                  `[Reboot] Setting of offline reader cache entry for 'OpsTicket.ShowBrainSources' errored with ${error}`
                );
              });
          }
        },

        setIsLoading(isLoading: boolean) {
          for (const setIsLoading of Object.values(this.setIsLoadings)) {
            setIsLoading(isLoading);
          }
        },

        setStatus(status: reboot_api.Status) {
          // Store the status, delete the response.
          this.status = status;
          delete this.response;

          // Trigger response or aborted has been received event (if
          // it wasn't triggered already).
          this.event.set();

          for (const setStatus of Object.values(this.setStatuses)) {
            setStatus(status);
          }
        },
      };

      this.showBrainSourcesFinalizationRegistry.register(
        promise,
        () => {
          if (!reader.used) {
            delete this.useShowBrainSourcesReaders[requestBearerTokenHash];
            reader.abortController.abort();
          }
        }
      );

      // We want to remove the promise so that it can be garbage collected
      // which is our indication that React is no longer using it. But this
      // races with calls to `useShowBrainSources(...)`
      // that might be adding their `setResponse`, `setIsLoading`, etc, so
      // we delay deleting the promise for at least a second.
      //
      // Note that deleting the promise is okay because all subsequent calls
      // will simply use the `reader.response` since it will no longer be
      // undefined.
      reader.promise.then(async () => {
        // Allow the call to `useShowBrainSources(...)`
        // at least 5 seconds to indicate that the reader is being used,
        // afterwhich, once `reader.promise` gets garbage collected
        // we'll know that it must have been abandoned by React, e.g.,
        // because the component was suspended and never committed.
        await reboot_api.sleep({ ms: 5000 });

        delete reader.promise;
      });

      this.useShowBrainSourcesReaders[requestBearerTokenHash] = reader;

      // Start fetching from the server.
      this.read(
        "ShowBrainSources",
        serializedRequest,
        bearerToken,
        loopos_pb.OpsTicketShowBrainSourcesResponse,
        reader
      );

      // Check if there is a cached result if applicable.
      if (offlineCacheEnabled) {
        reboot_api.assert(cacheKey !== null);

        reboot_web.offlineCache().get(cacheKey).then((cachedResponse) => {
          if (cachedResponse !== null) {
            // We only want to set the response if we haven't already
            // gotten a response from the server as it is the authority
            // and should take precedence.
            if (reader.response === undefined) {
              reader.setResponse(
                loopos_pb.OpsTicketShowBrainSourcesResponse.fromJsonString(cachedResponse),
                { cache: false } // Don't re-cache the value!
              );
            }
          }
        }).catch((error) => {
          console.warn(
            `[Reboot] Retrieval of offline reader cache entry for 'OpsTicket.ShowBrainSources' errored with ${error}`
          );
        });
      }
    }

    reboot_api.assert(reader !== undefined);

    return reader;
  }

  useShowBrainSources(
    id: string,
    requestBearerTokenHash: string,
    serializedRequest: Uint8Array,
    bearerToken: string | undefined,
    offlineCacheEnabled: boolean,
    cacheKey: string | null,
    setResponse: (response: loopos_pb.OpsTicketShowBrainSourcesResponse) => void,
    setIsLoading: (isLoading: boolean) => void,
    setStatus: (status: reboot_api.Status) => void
  ) {
    // We need to call start here because with strict mode the
    // `useEffect` that calls this method will also call "unuse"
    // which will mean the next time the `useEffect` calls here
    // we'll create a new reader in start.
    const reader = this.startShowBrainSources(
      requestBearerTokenHash,
      serializedRequest,
      bearerToken,
      offlineCacheEnabled,
      cacheKey
    );

    reboot_api.assert(reader !== undefined);

    // Indicate that the reader has properly been used so that we don't
    // clean it up prematurely.
    reader.used = true;

    reader.setResponses[id] = setResponse;
    reader.setIsLoadings[id] = setIsLoading;
    reader.setStatuses[id] = setStatus;

    // If we already have a `response` or `status` need to set it.
    if (reader.response) {
      setResponse(reader.response);
      setIsLoading(false);
    } else if (reader.status) {
      setStatus(reader.status);
    }
  }

  unuseShowBrainSources(
    id: string,
    requestBearerTokenHash: string,
  ) {
    const reader = this.useShowBrainSourcesReaders[requestBearerTokenHash];

    reboot_api.assert(reader !== undefined);

    delete reader.setResponses[id];
    delete reader.setIsLoadings[id];
    delete reader.setStatuses[id];

    // Schedule a timeout to delete and abort this reader if we're the
    // last user. We need a timeout because, with StrictMode turned on,
    // we can't remove the reader right away otherwise we won't have a
    // stable Event and Promise. We use 3 seconds but may need to make
    // configurable depending on the application.
    if (Object.values(reader.setResponses).length === 0) {
      reader.scheduledUnusedTimeoutsCount += 1;
      setTimeout(() => {
        reader.scheduledUnusedTimeoutsCount -= 1;
        if (
          reader.scheduledUnusedTimeoutsCount === 0 &&
          Object.values(reader.setResponses).length === 0
        ) {
          delete this.useShowBrainSourcesReaders[requestBearerTokenHash];
          reader.abortController.abort();
        }
      }, 3000);
    }
  }


  private static instances: { [id: string]: OpsTicketInstance } = {};

  static use(id: string, stateRef: string, url: string) {
    if (!(id in this.instances)) {
      this.instances[id] = new OpsTicketInstance(id, stateRef, url);
    } else {
      this.instances[id].ref();
    }

    return this.instances[id];
  }

  unuse() {
    if (this.unref() === 0) {
      delete OpsTicketInstance.instances[this.id];
    }
  }
}


export const useOpsTicket = (
  { id }: { id: string }
): UseOpsTicketApi => {
  // PATCH: Reboot codegen omits these from useOpsTicket but inner hooks
  // (useTriage, useAcknowledgeDispatch, useProposeNewRule, etc.) reference
  // them in useMemo dependency arrays. Without these declarations the bundle
  // throws ReferenceError: mcpApp is not defined at first render.
  const mcpApp = useMcpApp();
  const mcpToolData = useMcpToolData();
  void mcpApp; void mcpToolData;

  const stateRef = reboot_api.stateIdToRef(
    "loopos.v1.OpsTicket",
    id,
  );

  const rebootClient = reboot_react.useRebootClient();

  const url = rebootClient.url;
  const bearerToken = rebootClient.bearerToken;
  const refreshMCPBearerToken = useRefreshMCPBearerToken();

  const [instance, setInstance] = useState(() => {
    return OpsTicketInstance.use(
      id, stateRef, url
    );
  });

  if (instance.id !== id) {
    setInstance(
      OpsTicketInstance.use(
        id, stateRef, url
      )
    );
  }

  useEffect(() => {
    return () => {
      instance.unuse();
    };
  }, [instance]);

  const headers = useMemo(() => {
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.append("Connection", "keep-alive");

    if (bearerToken !== undefined) {
      headers.append("Authorization", `Bearer ${bearerToken}`);
    }

    return headers;
  }, [bearerToken]);


  function useCreate() {
    const [
      pending,
      setPending
    ] = useState<PendingOpsTicketCreateMutation[]>([]);

    useEffect(() => {
      const id = uuidv4();
      instance.useCreate(id, setPending);
      return () => {
        instance.unuseCreate(id);
      };
    }, []);

    const rebootClient = reboot_react.useRebootClient();

    const bearerToken = rebootClient.bearerToken;

    const create = useMemo(() => {
      const method = async (
        partialRequest: OpsTicket.PartialCreateRequest = {},
        options?: { metadata?: any, key?: string }
      ) => {
        const request = OpsTicketCreateRequestToProtobuf(partialRequest);

        const idempotencyKey = options?.idempotencyKey ?? options?.key ?? reboot_web.makeExpiringIdempotencyKey();

        const mutation = {
          request,
          idempotencyKey,
          bearerToken,
          metadata: options?.metadata,
          isLoading: false, // Won't start loading if we're flushing mutations.
        };

        return instance.create(mutation);
      };

      method.pending =
        new Array<PendingOpsTicketCreateMutation>();

      return method;
    }, [instance, bearerToken]);

    create.pending = pending;

    return create;
  }

  const create = useCreate();


  function useTriage() {
    const [
      pending,
      setPending
    ] = useState<PendingOpsTicketTriageMutation[]>([]);

    useEffect(() => {
      const id = uuidv4();
      instance.useTriage(id, setPending);
      return () => {
        instance.unuseTriage(id);
      };
    }, []);

    const rebootClient = reboot_react.useRebootClient();

    const bearerToken = rebootClient.bearerToken;

    const triage = useMemo(() => {
      const method = async (
        partialRequest: OpsTicket.PartialTriageRequest = {},
        options?: { metadata?: any, key?: string }
      ) => {
        const request = OpsTicketTriageRequestToProtobuf(partialRequest);

        const idempotencyKey = options?.idempotencyKey ?? options?.key ?? reboot_web.makeExpiringIdempotencyKey();

        const mutation = {
          request,
          idempotencyKey,
          bearerToken,
          metadata: options?.metadata,
          isLoading: false, // Won't start loading if we're flushing mutations.
        };

        return instance.triage(mutation);
      };

      method.pending =
        new Array<PendingOpsTicketTriageMutation>();

      return method;
    }, [instance, bearerToken, mcpApp, id]);

    triage.pending = pending;

    return triage;
  }

  const triage = useTriage();


  function useAcknowledgeDispatch() {
    const [
      pending,
      setPending
    ] = useState<PendingOpsTicketAcknowledgeDispatchMutation[]>([]);

    useEffect(() => {
      const id = uuidv4();
      instance.useAcknowledgeDispatch(id, setPending);
      return () => {
        instance.unuseAcknowledgeDispatch(id);
      };
    }, []);

    const rebootClient = reboot_react.useRebootClient();

    const bearerToken = rebootClient.bearerToken;

    const acknowledgeDispatch = useMemo(() => {
      const method = async (
        partialRequest: OpsTicket.PartialAcknowledgeDispatchRequest = {},
        options?: { metadata?: any, key?: string }
      ) => {
        const request = OpsTicketAcknowledgeDispatchRequestToProtobuf(partialRequest);

        const idempotencyKey = options?.idempotencyKey ?? options?.key ?? reboot_web.makeExpiringIdempotencyKey();

        const mutation = {
          request,
          idempotencyKey,
          bearerToken,
          metadata: options?.metadata,
          isLoading: false, // Won't start loading if we're flushing mutations.
        };

        return instance.acknowledgeDispatch(mutation);
      };

      method.pending =
        new Array<PendingOpsTicketAcknowledgeDispatchMutation>();

      return method;
    }, [instance, bearerToken, mcpApp, id]);

    acknowledgeDispatch.pending = pending;

    return acknowledgeDispatch;
  }

  const acknowledgeDispatch = useAcknowledgeDispatch();


  function useProposeNewRule() {
    const [
      pending,
      setPending
    ] = useState<PendingOpsTicketProposeNewRuleMutation[]>([]);

    useEffect(() => {
      const id = uuidv4();
      instance.useProposeNewRule(id, setPending);
      return () => {
        instance.unuseProposeNewRule(id);
      };
    }, []);

    const rebootClient = reboot_react.useRebootClient();

    const bearerToken = rebootClient.bearerToken;

    const proposeNewRule = useMemo(() => {
      const method = async (
        partialRequest: OpsTicket.PartialProposeNewRuleRequest = {},
        options?: { metadata?: any, key?: string }
      ) => {
        const request = OpsTicketProposeNewRuleRequestToProtobuf(partialRequest);

        const idempotencyKey = options?.idempotencyKey ?? options?.key ?? reboot_web.makeExpiringIdempotencyKey();

        const mutation = {
          request,
          idempotencyKey,
          bearerToken,
          metadata: options?.metadata,
          isLoading: false, // Won't start loading if we're flushing mutations.
        };

        return instance.proposeNewRule(mutation);
      };

      method.pending =
        new Array<PendingOpsTicketProposeNewRuleMutation>();

      return method;
    }, [instance, bearerToken, mcpApp, id]);

    proposeNewRule.pending = pending;

    return proposeNewRule;
  }

  const proposeNewRule = useProposeNewRule();



  function useShowBrainSources(
    partialRequest: OpsTicket.PartialShowBrainSourcesRequest = {},
    options: { suspense: boolean } = { suspense: false }
  ) {
    const newRequest = OpsTicketShowBrainSourcesRequestToProtobuf(partialRequest);

    const [request, setRequest] = useState(newRequest);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const rebootClient = reboot_react.useRebootClient();

    const bearerToken = rebootClient.bearerToken;

    const serializedRequest = useMemo(() => request.toBinary(), [request]);

    // To distinguish this call from others when caching responses on
    // the client we compute a "request hash" using SHA256 from the
    // `request`.
    // We memoize this so we don't do it every time.
    const requestHash: string = useMemo(
      () => {
        const hash = reboot_web.calcSha256();
        hash.add(serializedRequest);
        return hash.digest().hex();
      },
      [serializedRequest]
    );

    // To create a map of unused readers globally on the client, we
    // compute a "request hash" using SHA256 from the `request`
    // including the bearerToken.
    // We memoize this so we don't do it every time.
    const requestBearerTokenHash: string = useMemo(
      () => {
        const hash = reboot_web.calcSha256();
        hash.add(serializedRequest);
        if (bearerToken) {
          hash.add(bearerToken);
        }
        return hash.digest().hex();
      },
      [serializedRequest, bearerToken]
    );

    const offlineCacheEnabled = rebootClient.offlineCacheEnabled;

    const cacheKey: string | null = useMemo(
      () => {
        if (offlineCacheEnabled) {
          return `${stateRef}:ShowBrainSources:${requestHash}`;
        }
        return null;
      },
      [stateRef, offlineCacheEnabled, requestHash]
    );

    // We start reading here, or if another component already started
    // the reading then we just get back the reader. We need to do this
    // before setting up our `useState`s because when using suspense
    // we need to use the `reader.response` or `reader.status` during
    // render where one of them will be defined, i.e., after we've
    // waited for `reader.promise` via `React.use()`.
    const reader = instance.startShowBrainSources(
      requestBearerTokenHash,
      serializedRequest,
      bearerToken,
      offlineCacheEnabled,
      cacheKey
    );

    const [response, setResponse] = useState<
      OpsTicket.ShowBrainSourcesResponse | undefined
      >(reader.response && OpsTicketShowBrainSourcesResponseFromProtobufShape(reader.response));

    const [aborted, setAborted] = useState<
      OpsTicketShowBrainSourcesAborted | undefined
      >(reader.status && OpsTicketShowBrainSourcesAborted.fromStatus(reader.status));

    // Track which state ID the current `response` and `aborted` belong
    // to so we can reset them when the state ID changes, back into
    // their "loading" state. We track `id` rather than `instance`
    // because `id` updates immediately from props, whereas `instance`
    // only updates later after a separate `setState`.
    const [responseStateId, setResponseStateId] = useState(id);
    if (responseStateId !== id) {
      setResponseStateId(id);
      setResponse(undefined);
      setAborted(undefined);
      setIsLoading(true);
    }

    useEffect(() => {
      const id = uuidv4();

      instance.useShowBrainSources(
        id,
        requestBearerTokenHash,
        serializedRequest,
        bearerToken,
        offlineCacheEnabled,
        cacheKey,
        (response: loopos_pb.OpsTicketShowBrainSourcesResponse) => {
          setAborted(undefined);
          setResponse(OpsTicketShowBrainSourcesResponseFromProtobufShape(response));
        },
        setIsLoading,
        (status: reboot_api.Status) => {
          // If the server rejected us due to an expired
          // token, refresh via the MCP host. The token
          // change triggers a re-render and reconnect.
          if (
            status.code === reboot_api.StatusCode.UNAUTHENTICATED &&
            refreshMCPBearerToken
          ) {
            refreshMCPBearerToken();
          }

          const aborted = OpsTicketShowBrainSourcesAborted.fromStatus(status);

          console.warn(
            `[Reboot] 'OpsTicket.ShowBrainSources' aborted with ${aborted.message}`
          );

          setAborted(aborted);
          setResponse(undefined);
        },
      );

      return () => {
        instance.unuseShowBrainSources(id, requestBearerTokenHash);
      };
    }, [
      instance,
      serializedRequest,
      requestBearerTokenHash,
      bearerToken,
      offlineCacheEnabled,
      cacheKey,
    ]);

    // If the user has requested suspense via `options.suspense` then
    // we need to use `useMemo` to create a stable promise to pass
    // to `React.use()`. This is important for two reasons:
    //
    // 1. `reader.promise` gets deleted after 5 seconds to
    //    allow GC-based detection of abandoned readers (via
    //    `FinalizationRegistry`), so we can't pass it directly
    //    on every render.
    //
    // 2. `React.use()` suspends at least once for each new
    //    promise it sees (to call `.then()`), so we must
    //    return the same promise across re-renders for a given
    //    reader.
    //
    // When suspense is not requested, or the reader's event is
    // already set (i.e., we have a response or aborted status),
    // we return a pre-resolved promise. Note that `React.use()`
    // will suspend at least once even for a pre-resolved promise
    // in order to set internal state on it, but on subsequent
    // renders it will recognize the same promise and return
    // without suspending.
	//
	// We need to store the suspense promise in a `useRef` so
	// that we can continually return it even if the reader is
	// changing due to things like the `bearerToken` changing,
	// however, we don't want to flicker the suspense fallback
	// when `bearerToken` changes after we've already received
	// a stable `response` (or `aborted`).
	const suspensePromiseRef = useRef(undefined);

    const suspensePromise = useMemo(
      () => {
	    if (suspensePromiseRef.current === undefined || (response === undefined && aborted === undefined)) {
          if (!options.suspense || reader.event.isSet()) {
		    suspensePromiseRef.current = Promise.resolve();
          } else {
            reboot_api.assert(reader.promise !== undefined);
			reboot_api.assert(response === undefined);
			reboot_api.assert(aborted === undefined);
            suspensePromiseRef.current = reader.promise.then(() => {});
          }
		}        
		return suspensePromiseRef.current;
      },
      [options.suspense, reader, response, aborted]
    );

    if (options.suspense) {
      if (!("use" in React)) {
        // Raise if it doesn't look like we are using React>=19.
        const error = "In order to pass `suspense: true` to a Reboot reactive reader you must be using React>=19 which provides `React.use`";
        console.error(error);
        throw new Error(error);
      }

      React.use(suspensePromise);
    }

    if (!request.equals(newRequest)) {
      setRequest(newRequest);
      setIsLoading(true);

      return { response, isLoading: true, aborted };
    }

    return { response, isLoading, aborted };
  }

  async function showBrainSources(
    partialRequest: OpsTicket.PartialShowBrainSourcesRequest = {},
    options?: { signal?: AbortSignal; retry?: boolean }
  ) {
    let retry = true;
    if (options !== undefined && options.retry !== undefined) {
      retry = options.retry;
    }

    const request = OpsTicketShowBrainSourcesRequestToProtobuf(partialRequest);

    // Fetch with retry, using a backoff, i.e., if we get disconnected.
    const { response, aborted } = await (async () => {
      const backoff = new reboot_api.Backoff();

      while (true) {
        try {
          // Invariant here is that we use the '/package.service.method' path and
          // HTTP 'POST' method (we need 'POST' because we send an HTTP body).
          //
          // See also 'reboot/helpers.py'.
          return {
            response: await reboot_web.guardedFetch(
              new Request(
                `${rebootClient.url}/__/reboot/rpc/${stateRef}/loopos.v1.OpsTicketMethods/ShowBrainSources`, {
                  method: "POST",
                  headers,
                  body: request.toJsonString()
                }
              ),
              options
            )
          };
        } catch (e: unknown) {
          if (options?.signal?.aborted || !retry) {
            const aborted = new OpsTicketShowBrainSourcesAborted(
              new reboot_api.errors_pb.Aborted(), {
                message: e instanceof Error
                  ? `${e}`
                  : `Unknown error: ${JSON.stringify(e)}`
              }
            );

            return { aborted };
          } else if (e instanceof Error) {
            console.error(e);
          } else {
            console.error(`[Reboot] Unknown error: ${JSON.stringify(e)}`);
          }
        }

        await backoff.wait(`[Reboot] Retrying call to \`loopos.v1.OpsTicketMethods.ShowBrainSources\` with backoff...`);
      }
    })();

    if (aborted) {
      return { aborted };
    } else if (response.status === 401 && refreshMCPBearerToken) {
      // Token expired — refresh via MCP host and retry once.
      const newToken = await refreshMCPBearerToken();
      if (newToken) {
        const retryHeaders = new Headers();
        retryHeaders.set("Content-Type", "application/json");
        retryHeaders.append("Connection", "keep-alive");
        retryHeaders.append("Authorization", `Bearer ${newToken}`);
        try {
          const retryResponse = await reboot_web.guardedFetch(
            new Request(
              `${rebootClient.url}/__/reboot/rpc/${stateRef}/loopos.v1.OpsTicketMethods/ShowBrainSources`, {
                method: "POST",
                headers: retryHeaders,
                body: request.toJsonString()
              }
            ),
            options
          );
          if (retryResponse.ok) {
            return {
              response:
                OpsTicketShowBrainSourcesResponseFromProtobufShape((loopos_pb.OpsTicketShowBrainSourcesResponse.fromJson(await retryResponse.json())))
            };
          }
          // Fall through to generic error handling on retry failure.
          return {
            aborted: new OpsTicketShowBrainSourcesAborted(
              new reboot_api.errors_pb.Unknown(), {
                message: `Unknown error with HTTP status ${retryResponse.status} after token refresh`
              }
            )
          };
        } catch (e: unknown) {
          return {
            aborted: new OpsTicketShowBrainSourcesAborted(
              new reboot_api.errors_pb.Aborted(), {
                message: e instanceof Error
                  ? `${e}`
                  : `Unknown error: ${JSON.stringify(e)}`
              }
            )
          };
        }
      }
      // Refresh failed — fall through to generic error.
      return {
        aborted: new OpsTicketShowBrainSourcesAborted(
          new reboot_api.errors_pb.Unknown(), {
            message: `Unauthorized (HTTP 401) and token refresh failed`
          }
        )
      };
    } else if (!response.ok) {
      if (response.headers.get("content-type") === "application/json") {
        const status = reboot_api.Status.fromJson(await response.json());


        // If the server rejected us due to an expired
        // token, refresh via the MCP host and retry once.
        if (
          status.code === reboot_api.StatusCode.UNAUTHENTICATED &&
          refreshMCPBearerToken
        ) {
          const newToken = await refreshMCPBearerToken();
          if (newToken) {
            const retryHeaders = new Headers();
            retryHeaders.set(
              "Content-Type", "application/json",
            );
            retryHeaders.append(
              "Connection", "keep-alive",
            );
            retryHeaders.append(
              "Authorization", `Bearer ${newToken}`,
            );
            try {
              const retryResponse =
                await reboot_web.guardedFetch(
                  new Request(
                    `${rebootClient.url}/__/reboot/rpc/${stateRef}/loopos.v1.OpsTicketMethods/ShowBrainSources`, {
                      method: "POST",
                      headers: retryHeaders,
                      body: request.toJsonString()
                    }
                  ),
                  options
                );
              if (retryResponse.ok) {
                return {
                  response:
                    OpsTicketShowBrainSourcesResponseFromProtobufShape((loopos_pb.OpsTicketShowBrainSourcesResponse.fromJson(await retryResponse.json())))
                };
              }
            } catch {
              // Fall through to return the original
              // aborted error.
            }
          }
        }

        const aborted = OpsTicketShowBrainSourcesAborted.fromStatus(status);

        console.warn(
          `[Reboot] 'OpsTicket.ShowBrainSources' aborted with ${aborted.message}`
        );

        return { aborted };
      } else {
        const aborted = new OpsTicketShowBrainSourcesAborted(
          new reboot_api.errors_pb.Unknown(), {
            message: `Unknown error with HTTP status ${response.status}`
          }
        );

        return { aborted };
      }
    } else {
      return {
        response:
          OpsTicketShowBrainSourcesResponseFromProtobufShape((loopos_pb.OpsTicketShowBrainSourcesResponse.fromJson(await response.json())))
      };
    }
  }


  // Don't re-render if `id` hasn't changed.
    return useMemo(() => ({
      mutators: {
        create,
        triage,
        acknowledgeDispatch,
        proposeNewRule,
      },
      idempotently: ({ key }: { key: string }) => {
      return {
        create: (
          partialRequest?:OpsTicket.PartialCreateRequest,
          options?: { metadata?: any }
        ) => create(partialRequest, { ...options, key }),
        triage: (
          partialRequest?:OpsTicket.PartialTriageRequest,
          options?: { metadata?: any }
        ) => triage(partialRequest, { ...options, key }),
        acknowledgeDispatch: (
          partialRequest?:OpsTicket.PartialAcknowledgeDispatchRequest,
          options?: { metadata?: any }
        ) => acknowledgeDispatch(partialRequest, { ...options, key }),
        proposeNewRule: (
          partialRequest?:OpsTicket.PartialProposeNewRuleRequest,
          options?: { metadata?: any }
        ) => proposeNewRule(partialRequest, { ...options, key }),
      };
    },
      create,
      triage,
      acknowledgeDispatch,
      proposeNewRule,
      showBrainSources,
      useShowBrainSources,
    }), [id, instance, bearerToken]);
};



export class OpsTicket {
  static State = OpsTicketProto;
}
export namespace OpsTicket {
  export type State = OpsTicketProto;
}

export interface SettingsParams {
  id: string;
  storeMutationsLocallyInNamespace?: string;
}

class UserInstance {

  constructor(id: string, stateRef: string, url: string) {
    this.id = id;
    this.stateRef = stateRef;
    this.url = url;
    this.refs = 1;

     reboot_web.websockets.connect(this.url, this.stateRef);
    this.initializeWebSocket();
  }

  private ref() {
    this.refs += 1;
    return this.refs;
  }

  private unref() {
    this.refs -= 1;

    if (this.refs === 0 && this.websocket !== undefined) {
      this.websocket.close();
       reboot_web.websockets.disconnect(this.url, this.stateRef);
    }

    return this.refs;
  }

  readonly id: string;
  readonly stateRef: string;
  private url: string;
  private refs: number;
  private observers: reboot_react.Observers = {};
  private loadingReaders = 0;
  private runningMutates: reboot_react.Mutate[] = [];
  private queuedMutates: reboot_react.Mutate[] = [];
  private flushMutates?: reboot_api.Event = undefined;
  private websocket?: WebSocket = undefined;
  private backoff: reboot_api.Backoff = new reboot_api.Backoff();

  private hasRunningMutations() {
    return this.runningMutates.length > 0;
  }

  private async flushMutations() {
    if (this.flushMutates === undefined) {
      this.flushMutates = new reboot_api.Event();
    }
    await this.flushMutates.wait();
  }

  private readersLoadedOrFailed() {
    this.flushMutates = undefined;

    if (this.queuedMutates.length > 0) {
      this.runningMutates = this.queuedMutates;
      this.queuedMutates = [];

      if (this.websocket?.readyState === WebSocket.OPEN) {
        for (const { request, update } of this.runningMutates) {
          update({ isLoading: true });
          try {
            this.websocket.send(request.toBinary());
          } catch {
            // We'll retry since we've stored in `*Mutates`.
          }
        }
      }
    }
  }

  private initializeWebSocket() {
    if (this.websocket === undefined && this.refs > 0) {
      const url = new URL(`${this.url}/__/reboot/rpc/${this.stateRef}`);
      url.protocol = url.protocol === "https:" ? "wss:" : "ws:";

      this.websocket = reboot_web.websockets.create(url);

      this.websocket.binaryType = "arraybuffer";

      this.websocket.onopen = () => {
        if (this.websocket?.readyState === WebSocket.OPEN) {
          for (const { request, update } of this.runningMutates) {
            update({ isLoading: true });
            try {
              this.websocket.send(request.toBinary());
            } catch {
              // We'll retry since we've stored in `*Mutates`.
            }
          }
        }
      };

      this.websocket.onerror = async () => {
        if (this.websocket !== undefined) {
          this.websocket = undefined;

          for (const { update } of this.runningMutates) {
            update({ isLoading: false, error: "WebSocket disconnected" });
          }

          if (this.refs > 0) {
            if (this.runningMutates.length > 0) {
              console.warn(
                `[Reboot] WebSocket disconnected, ${this.runningMutates.length} outstanding mutations will be retried when we reconnect`
              );
            }

            await this.backoff.wait();

            this.initializeWebSocket();
          }
        }
      };

      this.websocket.onclose = async () => {
        if (this.websocket !== undefined) {
          this.websocket = undefined;

          for (const { update } of this.runningMutates) {
            update({ isLoading: false, error: "WebSocket disconnected" });
          }

          if (this.refs > 0) {
            await this.backoff.wait();

            this.initializeWebSocket();
          }
        }
      };

      this.websocket.onmessage = async (event) => {
        const { resolve } = this.runningMutates[0];
        this.runningMutates.shift();

        const response = reboot_api.react_pb.MutateResponse.fromBinary(
          new Uint8Array(event.data)
        );

        resolve(response);

        if (
          this.flushMutates !== undefined &&
          this.runningMutates.length === 0
        ) {
          this.flushMutates.set();
        }
      };
    }
  }

  private async mutate(
    partialRequest: protobuf_es.PartialMessage<reboot_api.react_pb.MutateRequest>,
    update: (props: { isLoading: boolean; error?: any }) => void
  ): Promise<reboot_api.react_pb.MutateResponse> {
    const request = partialRequest instanceof reboot_api.react_pb.MutateRequest
      ? partialRequest
      : new reboot_api.react_pb.MutateRequest(partialRequest);

    return new Promise((resolve, _) => {
      if (this.loadingReaders === 0) {
        this.runningMutates = this.runningMutates.concat({ request, resolve, update });
        if (this.websocket?.readyState === WebSocket.OPEN) {
          update({ isLoading: true });
          try {
            this.websocket.send(request.toBinary());
          } catch {
            // We'll retry since we've stored in `*Mutates`.
          }
        }
      } else {
        this.queuedMutates = this.queuedMutates.concat({ request, resolve, update });
      }
    });
  }

  private async read<
    RequestType extends protobuf_es.Message<RequestType>,
    ResponseType extends protobuf_es.Message<ResponseType>,
    >(
    method: string,
    serializedRequest: Uint8Array,
    bearerToken: string | undefined,
    responseType: protobuf_es.MessageType<ResponseType>,
    reader: reboot_react.Reader<ResponseType>
  ) {
    const queryRequest = new reboot_api.react_pb.QueryRequest({
      method,
      request: serializedRequest,
      ...(bearerToken !== undefined && { bearerToken } || {}),
    });

    // Expected idempotency key we should observe due to a mutation.
    interface Expected {
      // Idempotency key of mutation.
      idempotencyKey: string;

      // Callback when we've observed this idempotency key.
      observed: (callback: () => void) => Promise<void>;

      // Callback when we no longer care about observing.
      aborted: () => void;
    }

    let expecteds: Expected[] = [];

    // When we disconnect we may not be able to observe
    // responses due to mutations yet there may still be
    // some outstanding responses that are expected which
    // we treat as "orphans" in the sense that we won't
    // observe their idempotency keys but once we reconnect
    // we will still have observed their effects and can
    // call `observed()` on them.
    let orphans: Expected[] = [];

    const id = `${uuidv4()}`;

    this.observers[id] = {
      observe: (
        idempotencyKey: string,
        observed: (callback: () => void) => Promise<void>,
        aborted: () => void
      ) => {
        expecteds = expecteds.concat({ idempotencyKey, observed, aborted })
      },
      unobserve: (idempotencyKey: string) => {
        expecteds = expecteds.filter(
          expected => expected.idempotencyKey !== idempotencyKey
        );

        orphans = orphans.filter(
          orphan => orphan.idempotencyKey !== idempotencyKey
        );
      }
    };

    try {
      await reboot_api.retryForever(async () => {
        let loaded = false;
        this.loadingReaders += 1;

        // Any mutations started after we've incremented
        // `this.loadingReaders` will be queued until after
        // all the readers have loaded and thus (1) we know all
        // current `expected` are actually `orphans` that
        // we will haved "observed" once we are (re)connected
        // because we flush mutations before starting to read
        // and (2) all queued mutations can stay in `expected`
        // because we will in fact be able to observe them
        // since they won't get sent over the websocket
        // until after we are (re)connected.
        //
        // NOTE: we need to concatenate with `orphans`
        // because we may try to (re)connect multiple times
        // and between each try more mutations may have been
        // made (or queued ones will be moved to running).
        orphans = [...orphans, ...expecteds];
        expecteds = [];

        try {
          // Wait for potentially completed mutations to flush
          // before starting to read so that we read the latest
          // state including those mutations.
          if (this.hasRunningMutations()) {
            await this.flushMutations();
          }

          reader.setIsLoading(true);

          const queryResponses = reboot_web.reactiveReader({
            endpoint: `${this.url}/__/reboot/rpc/${this.stateRef}`,
            request: queryRequest,
            signal: reader.abortController.signal,
          });

          for await (const queryResponse of queryResponses) {
            if (!loaded) {
              if ((this.loadingReaders -= 1) === 0) {
                this.readersLoadedOrFailed();
              }
              loaded = true;
            }

            reader.setIsLoading(false);

            const response = queryResponse.responseOrStatus.case === "response"
              ? responseType.fromBinary(queryResponse.responseOrStatus.value)
              : undefined;

            // If we were disconnected it must be that we've
            // observed all `orphans` because we waited
            // for any mutations to flush before we re-started to
            // read.
            const haveOrphans = orphans.length;
            if (haveOrphans > 0) {
              // We mark all mutations as observed except the
              // last one which we also invoke all `setResponse`s.
              // In this way we effectively create a barrier
              // for all readers that will synchronize on the last
              // mutation, but note that this still may lead
              // to some partial state/response updates because
              // one reader may have actually received a response
              // while another reader got disconnected. While this
              // is likely very rare, it is possible. Mitigating
              // this issue is non-trivial and for now we have
              // no plans to address it.
              for (let i = 0; i < orphans.length - 1; i++) {
                orphans[i].observed(() => {});
              }
              await orphans[orphans.length - 1].observed(() => {
                if (response !== undefined) {
                  reader.setResponse(response);
                }
              });

              orphans = [];
            }
            // We want to check the orphans list AND the expecteds list because
            // it could be possible that we receive a query response that
            // contains an idempotency key that we are expecting while having an
            // orphans list with a length greater than 0. In this case, we don't
            // want to skip checking the expecteds list just because we have
            // already checked the orphans list.
            if (
              expecteds.length > 0 &&
              queryResponse.idempotencyKeys.includes(
                expecteds[0].idempotencyKey
              )
            ) {
              await expecteds[0].observed(() => {
                if (response !== undefined) {
                  reader.setResponse(response);
                }
                expecteds.shift();
              });
            }
            // If we don't have any orphans to observe and we don't have any expecteds to observe,
	          // or at least, the first expecteds _is not observed_ by this response, then go ahead and
	          // pass on the response because it might contain new data that should get shown to the
	          // user (e.g., in a chat app this could be a new chat message from a different user).
            else if (response !== undefined && !haveOrphans) {
              reader.setResponse(response);
            }
          }

          throw new Error('Not expecting stream to ever be done');
        } catch (e: unknown) {
          if (!loaded) {
            if ((this.loadingReaders -= 1) === 0) {
              this.readersLoadedOrFailed();
            }
          }

          loaded = false;

          if (reader.abortController.signal.aborted) {
            for (const { aborted } of [...orphans, ...expecteds]) {
              aborted();
            }
            return;
          }

          reader.setIsLoading(false);

          if (e instanceof reboot_api.Status) {
            reader.setStatus(e);
          } else {
            console.warn(
              `[Reboot] Caught unknown exception: ${e instanceof Error ? e.message : JSON.stringify(e)}`
            );
          }

          throw e; // This just retries!
        }
      });
    } finally {
      delete this.observers[id];
    }
  }


  private useIngestTextMessageMutations: (
    PendingUserIngestTextMessageMutation)[] = [];

  private useIngestTextMessageSetPendings: {
    [id: string]: (mutations: PendingUserIngestTextMessageMutation[]) => void
  } = {};

  async ingestTextMessage(
    mutation: PendingUserIngestTextMessageMutation
  ): Promise<
    reboot_web.ResponseOrAborted<
      User.IngestTextMessageResponse,
      UserIngestTextMessageAborted
  >> {
    // We always have at least 1 observer which is this function!
    let remainingObservers = 1;

    const event = new reboot_api.Event();

    let callbacks: (() => void)[] = [];

    const observed = (callback: () => void) => {
      callbacks = callbacks.concat(callback);
      remainingObservers -= 1;
      if (remainingObservers === 0) {
        for (const callback of callbacks) {
          callback();
        }
        event.set();
      }
      return event.wait();
    };

    const aborted = () => {
      observed(() => {});
    }

    // Tell observers about this pending mutation.
    for (const id in this.observers) {
      remainingObservers += 1;
      this.observers[id].observe(mutation.idempotencyKey, observed, aborted);
    }

    this.useIngestTextMessageMutations = this.useIngestTextMessageMutations.concat(mutation);

    for (const setPending of Object.values(this.useIngestTextMessageSetPendings)) {
      setPending(this.useIngestTextMessageMutations);
    }

    return new Promise<
      reboot_web.ResponseOrAborted<
        User.IngestTextMessageResponse,
        UserIngestTextMessageAborted
      >>(
      async (resolve, reject) => {
        const { responseOrStatus } = await this.mutate(
          {
            method: "IngestTextMessage",
            request: mutation.request.toBinary(),
            idempotencyKey: mutation.idempotencyKey,
            bearerToken: mutation.bearerToken,
          },
          ({ isLoading, error }: { isLoading: boolean; error?: any }) => {
            let rerender = false;
            for (const m of this.useIngestTextMessageMutations) {
              if (m === mutation) {
                if (m.isLoading !== isLoading) {
                  m.isLoading = isLoading;
                  rerender = true;
                }
                if (error !== undefined && m.error !== error) {
                  m.error = error;
                  rerender = true;
                }
              }
            }

            if (rerender) {
              for (const setPending of Object.values(this.useIngestTextMessageSetPendings)) {
                setPending(this.useIngestTextMessageMutations);
              }
            }
          }
        );

        const removeMutationsAndSetPending = () => {
          this.useIngestTextMessageMutations =
            this.useIngestTextMessageMutations.filter(m => m !== mutation);

          for (const setPending of Object.values(this.useIngestTextMessageSetPendings)) {
            setPending(this.useIngestTextMessageMutations);
          }
        }


        switch (responseOrStatus.case) {
          case "response": {
            await observed(() => {
              removeMutationsAndSetPending();
              resolve({
                response:
                  UserIngestTextMessageResponseFromProtobufShape(
                    loopos_pb.UserIngestTextMessageResponse.fromBinary(
                    responseOrStatus.value
                  )
                )
              });
            });
            break;
          }
          case "status": {
            // Let the observers know they no longer should expect to
            // observe this idempotency key.
            for (const id in this.observers) {
              this.observers[id].unobserve(mutation.idempotencyKey);
            }

            const status = reboot_api.Status.fromJsonString(responseOrStatus.value);

            const aborted = UserIngestTextMessageAborted.fromStatus(status);

            console.warn(
              `[Reboot] 'User.IngestTextMessage' aborted with ${aborted.message}`
            );

            removeMutationsAndSetPending();
            resolve({ aborted });

            break;
          }
          default: {
            // TODO(benh): while this is a _really_ fatal error,
            // should we still set `aborted` instead of throwing?
            reject(new Error('Expecting either a response or a status'));
          }
        }
      });
  }

  useIngestTextMessage(
    id: string,
    setPending: (mutations: PendingUserIngestTextMessageMutation[]) => void
  ) {
    this.useIngestTextMessageSetPendings[id] = setPending;
  }

  unuseIngestTextMessage(id: string) {
    delete this.useIngestTextMessageSetPendings[id];
  }


  private useIngestVoiceNoteMutations: (
    PendingUserIngestVoiceNoteMutation)[] = [];

  private useIngestVoiceNoteSetPendings: {
    [id: string]: (mutations: PendingUserIngestVoiceNoteMutation[]) => void
  } = {};

  async ingestVoiceNote(
    mutation: PendingUserIngestVoiceNoteMutation
  ): Promise<
    reboot_web.ResponseOrAborted<
      User.IngestVoiceNoteResponse,
      UserIngestVoiceNoteAborted
  >> {
    // We always have at least 1 observer which is this function!
    let remainingObservers = 1;

    const event = new reboot_api.Event();

    let callbacks: (() => void)[] = [];

    const observed = (callback: () => void) => {
      callbacks = callbacks.concat(callback);
      remainingObservers -= 1;
      if (remainingObservers === 0) {
        for (const callback of callbacks) {
          callback();
        }
        event.set();
      }
      return event.wait();
    };

    const aborted = () => {
      observed(() => {});
    }

    // Tell observers about this pending mutation.
    for (const id in this.observers) {
      remainingObservers += 1;
      this.observers[id].observe(mutation.idempotencyKey, observed, aborted);
    }

    this.useIngestVoiceNoteMutations = this.useIngestVoiceNoteMutations.concat(mutation);

    for (const setPending of Object.values(this.useIngestVoiceNoteSetPendings)) {
      setPending(this.useIngestVoiceNoteMutations);
    }

    return new Promise<
      reboot_web.ResponseOrAborted<
        User.IngestVoiceNoteResponse,
        UserIngestVoiceNoteAborted
      >>(
      async (resolve, reject) => {
        const { responseOrStatus } = await this.mutate(
          {
            method: "IngestVoiceNote",
            request: mutation.request.toBinary(),
            idempotencyKey: mutation.idempotencyKey,
            bearerToken: mutation.bearerToken,
          },
          ({ isLoading, error }: { isLoading: boolean; error?: any }) => {
            let rerender = false;
            for (const m of this.useIngestVoiceNoteMutations) {
              if (m === mutation) {
                if (m.isLoading !== isLoading) {
                  m.isLoading = isLoading;
                  rerender = true;
                }
                if (error !== undefined && m.error !== error) {
                  m.error = error;
                  rerender = true;
                }
              }
            }

            if (rerender) {
              for (const setPending of Object.values(this.useIngestVoiceNoteSetPendings)) {
                setPending(this.useIngestVoiceNoteMutations);
              }
            }
          }
        );

        const removeMutationsAndSetPending = () => {
          this.useIngestVoiceNoteMutations =
            this.useIngestVoiceNoteMutations.filter(m => m !== mutation);

          for (const setPending of Object.values(this.useIngestVoiceNoteSetPendings)) {
            setPending(this.useIngestVoiceNoteMutations);
          }
        }


        switch (responseOrStatus.case) {
          case "response": {
            await observed(() => {
              removeMutationsAndSetPending();
              resolve({
                response:
                  UserIngestVoiceNoteResponseFromProtobufShape(
                    loopos_pb.UserIngestVoiceNoteResponse.fromBinary(
                    responseOrStatus.value
                  )
                )
              });
            });
            break;
          }
          case "status": {
            // Let the observers know they no longer should expect to
            // observe this idempotency key.
            for (const id in this.observers) {
              this.observers[id].unobserve(mutation.idempotencyKey);
            }

            const status = reboot_api.Status.fromJsonString(responseOrStatus.value);

            const aborted = UserIngestVoiceNoteAborted.fromStatus(status);

            console.warn(
              `[Reboot] 'User.IngestVoiceNote' aborted with ${aborted.message}`
            );

            removeMutationsAndSetPending();
            resolve({ aborted });

            break;
          }
          default: {
            // TODO(benh): while this is a _really_ fatal error,
            // should we still set `aborted` instead of throwing?
            reject(new Error('Expecting either a response or a status'));
          }
        }
      });
  }

  useIngestVoiceNote(
    id: string,
    setPending: (mutations: PendingUserIngestVoiceNoteMutation[]) => void
  ) {
    this.useIngestVoiceNoteSetPendings[id] = setPending;
  }

  unuseIngestVoiceNote(id: string) {
    delete this.useIngestVoiceNoteSetPendings[id];
  }


  private useListTicketsReaders: {
    [requestBearerTokenHash: string]: reboot_react.Reader<loopos_pb.UserListTicketsResponse>
  } = {};

  private listTicketsFinalizationRegistry =
    new FinalizationRegistry((finalize) => finalize());

  startListTickets(
    requestBearerTokenHash: string,
    serializedRequest: Uint8Array,
    bearerToken: string | undefined,
    offlineCacheEnabled: boolean,
    cacheKey: string | null
  ) {
    let reader = this.useListTicketsReaders[requestBearerTokenHash];

    if (reader === undefined) {
      const event = new reboot_api.Event();

      const promise = event.wait();

      reader = {
        abortController: new AbortController(),
        event,
        promise,
        used: false,
        scheduledUnusedTimeoutsCount: 0,
        setResponses: {},
        setIsLoadings: {},
        setStatuses: {},

        setResponse(
          response: loopos_pb.UserListTicketsResponse,
          { cache }: { cache: boolean } = { cache: true }
        ) {
          // Store the response, delete the status.
          this.response = response;
          delete this.status;

          // Trigger response or aborted has been received event (if
          // it wasn't triggered already).
          this.event.set();

          // Dispatch to all listeners.
          for (const setResponse of Object.values(this.setResponses)) {
            setResponse(response);
          }

          // Cache response if applicable.
          if (cache && offlineCacheEnabled) {
            reboot_api.assert(cacheKey !== null);
            const cachedResponse = response.toJsonString();
            reboot_web.offlineCache().set(cacheKey, cachedResponse)
              .catch((error) => {
                console.warn(
                  `[Reboot] Setting of offline reader cache entry for 'User.ListTickets' errored with ${error}`
                );
              });
          }
        },

        setIsLoading(isLoading: boolean) {
          for (const setIsLoading of Object.values(this.setIsLoadings)) {
            setIsLoading(isLoading);
          }
        },

        setStatus(status: reboot_api.Status) {
          // Store the status, delete the response.
          this.status = status;
          delete this.response;

          // Trigger response or aborted has been received event (if
          // it wasn't triggered already).
          this.event.set();

          for (const setStatus of Object.values(this.setStatuses)) {
            setStatus(status);
          }
        },
      };

      this.listTicketsFinalizationRegistry.register(
        promise,
        () => {
          if (!reader.used) {
            delete this.useListTicketsReaders[requestBearerTokenHash];
            reader.abortController.abort();
          }
        }
      );

      // We want to remove the promise so that it can be garbage collected
      // which is our indication that React is no longer using it. But this
      // races with calls to `useListTickets(...)`
      // that might be adding their `setResponse`, `setIsLoading`, etc, so
      // we delay deleting the promise for at least a second.
      //
      // Note that deleting the promise is okay because all subsequent calls
      // will simply use the `reader.response` since it will no longer be
      // undefined.
      reader.promise.then(async () => {
        // Allow the call to `useListTickets(...)`
        // at least 5 seconds to indicate that the reader is being used,
        // afterwhich, once `reader.promise` gets garbage collected
        // we'll know that it must have been abandoned by React, e.g.,
        // because the component was suspended and never committed.
        await reboot_api.sleep({ ms: 5000 });

        delete reader.promise;
      });

      this.useListTicketsReaders[requestBearerTokenHash] = reader;

      // Start fetching from the server.
      this.read(
        "ListTickets",
        serializedRequest,
        bearerToken,
        loopos_pb.UserListTicketsResponse,
        reader
      );

      // Check if there is a cached result if applicable.
      if (offlineCacheEnabled) {
        reboot_api.assert(cacheKey !== null);

        reboot_web.offlineCache().get(cacheKey).then((cachedResponse) => {
          if (cachedResponse !== null) {
            // We only want to set the response if we haven't already
            // gotten a response from the server as it is the authority
            // and should take precedence.
            if (reader.response === undefined) {
              reader.setResponse(
                loopos_pb.UserListTicketsResponse.fromJsonString(cachedResponse),
                { cache: false } // Don't re-cache the value!
              );
            }
          }
        }).catch((error) => {
          console.warn(
            `[Reboot] Retrieval of offline reader cache entry for 'User.ListTickets' errored with ${error}`
          );
        });
      }
    }

    reboot_api.assert(reader !== undefined);

    return reader;
  }

  useListTickets(
    id: string,
    requestBearerTokenHash: string,
    serializedRequest: Uint8Array,
    bearerToken: string | undefined,
    offlineCacheEnabled: boolean,
    cacheKey: string | null,
    setResponse: (response: loopos_pb.UserListTicketsResponse) => void,
    setIsLoading: (isLoading: boolean) => void,
    setStatus: (status: reboot_api.Status) => void
  ) {
    // We need to call start here because with strict mode the
    // `useEffect` that calls this method will also call "unuse"
    // which will mean the next time the `useEffect` calls here
    // we'll create a new reader in start.
    const reader = this.startListTickets(
      requestBearerTokenHash,
      serializedRequest,
      bearerToken,
      offlineCacheEnabled,
      cacheKey
    );

    reboot_api.assert(reader !== undefined);

    // Indicate that the reader has properly been used so that we don't
    // clean it up prematurely.
    reader.used = true;

    reader.setResponses[id] = setResponse;
    reader.setIsLoadings[id] = setIsLoading;
    reader.setStatuses[id] = setStatus;

    // If we already have a `response` or `status` need to set it.
    if (reader.response) {
      setResponse(reader.response);
      setIsLoading(false);
    } else if (reader.status) {
      setStatus(reader.status);
    }
  }

  unuseListTickets(
    id: string,
    requestBearerTokenHash: string,
  ) {
    const reader = this.useListTicketsReaders[requestBearerTokenHash];

    reboot_api.assert(reader !== undefined);

    delete reader.setResponses[id];
    delete reader.setIsLoadings[id];
    delete reader.setStatuses[id];

    // Schedule a timeout to delete and abort this reader if we're the
    // last user. We need a timeout because, with StrictMode turned on,
    // we can't remove the reader right away otherwise we won't have a
    // stable Event and Promise. We use 3 seconds but may need to make
    // configurable depending on the application.
    if (Object.values(reader.setResponses).length === 0) {
      reader.scheduledUnusedTimeoutsCount += 1;
      setTimeout(() => {
        reader.scheduledUnusedTimeoutsCount -= 1;
        if (
          reader.scheduledUnusedTimeoutsCount === 0 &&
          Object.values(reader.setResponses).length === 0
        ) {
          delete this.useListTicketsReaders[requestBearerTokenHash];
          reader.abortController.abort();
        }
      }, 3000);
    }
  }


  private useQueryBrainReaders: {
    [requestBearerTokenHash: string]: reboot_react.Reader<loopos_pb.UserQueryBrainResponse>
  } = {};

  private queryBrainFinalizationRegistry =
    new FinalizationRegistry((finalize) => finalize());

  startQueryBrain(
    requestBearerTokenHash: string,
    serializedRequest: Uint8Array,
    bearerToken: string | undefined,
    offlineCacheEnabled: boolean,
    cacheKey: string | null
  ) {
    let reader = this.useQueryBrainReaders[requestBearerTokenHash];

    if (reader === undefined) {
      const event = new reboot_api.Event();

      const promise = event.wait();

      reader = {
        abortController: new AbortController(),
        event,
        promise,
        used: false,
        scheduledUnusedTimeoutsCount: 0,
        setResponses: {},
        setIsLoadings: {},
        setStatuses: {},

        setResponse(
          response: loopos_pb.UserQueryBrainResponse,
          { cache }: { cache: boolean } = { cache: true }
        ) {
          // Store the response, delete the status.
          this.response = response;
          delete this.status;

          // Trigger response or aborted has been received event (if
          // it wasn't triggered already).
          this.event.set();

          // Dispatch to all listeners.
          for (const setResponse of Object.values(this.setResponses)) {
            setResponse(response);
          }

          // Cache response if applicable.
          if (cache && offlineCacheEnabled) {
            reboot_api.assert(cacheKey !== null);
            const cachedResponse = response.toJsonString();
            reboot_web.offlineCache().set(cacheKey, cachedResponse)
              .catch((error) => {
                console.warn(
                  `[Reboot] Setting of offline reader cache entry for 'User.QueryBrain' errored with ${error}`
                );
              });
          }
        },

        setIsLoading(isLoading: boolean) {
          for (const setIsLoading of Object.values(this.setIsLoadings)) {
            setIsLoading(isLoading);
          }
        },

        setStatus(status: reboot_api.Status) {
          // Store the status, delete the response.
          this.status = status;
          delete this.response;

          // Trigger response or aborted has been received event (if
          // it wasn't triggered already).
          this.event.set();

          for (const setStatus of Object.values(this.setStatuses)) {
            setStatus(status);
          }
        },
      };

      this.queryBrainFinalizationRegistry.register(
        promise,
        () => {
          if (!reader.used) {
            delete this.useQueryBrainReaders[requestBearerTokenHash];
            reader.abortController.abort();
          }
        }
      );

      // We want to remove the promise so that it can be garbage collected
      // which is our indication that React is no longer using it. But this
      // races with calls to `useQueryBrain(...)`
      // that might be adding their `setResponse`, `setIsLoading`, etc, so
      // we delay deleting the promise for at least a second.
      //
      // Note that deleting the promise is okay because all subsequent calls
      // will simply use the `reader.response` since it will no longer be
      // undefined.
      reader.promise.then(async () => {
        // Allow the call to `useQueryBrain(...)`
        // at least 5 seconds to indicate that the reader is being used,
        // afterwhich, once `reader.promise` gets garbage collected
        // we'll know that it must have been abandoned by React, e.g.,
        // because the component was suspended and never committed.
        await reboot_api.sleep({ ms: 5000 });

        delete reader.promise;
      });

      this.useQueryBrainReaders[requestBearerTokenHash] = reader;

      // Start fetching from the server.
      this.read(
        "QueryBrain",
        serializedRequest,
        bearerToken,
        loopos_pb.UserQueryBrainResponse,
        reader
      );

      // Check if there is a cached result if applicable.
      if (offlineCacheEnabled) {
        reboot_api.assert(cacheKey !== null);

        reboot_web.offlineCache().get(cacheKey).then((cachedResponse) => {
          if (cachedResponse !== null) {
            // We only want to set the response if we haven't already
            // gotten a response from the server as it is the authority
            // and should take precedence.
            if (reader.response === undefined) {
              reader.setResponse(
                loopos_pb.UserQueryBrainResponse.fromJsonString(cachedResponse),
                { cache: false } // Don't re-cache the value!
              );
            }
          }
        }).catch((error) => {
          console.warn(
            `[Reboot] Retrieval of offline reader cache entry for 'User.QueryBrain' errored with ${error}`
          );
        });
      }
    }

    reboot_api.assert(reader !== undefined);

    return reader;
  }

  useQueryBrain(
    id: string,
    requestBearerTokenHash: string,
    serializedRequest: Uint8Array,
    bearerToken: string | undefined,
    offlineCacheEnabled: boolean,
    cacheKey: string | null,
    setResponse: (response: loopos_pb.UserQueryBrainResponse) => void,
    setIsLoading: (isLoading: boolean) => void,
    setStatus: (status: reboot_api.Status) => void
  ) {
    // We need to call start here because with strict mode the
    // `useEffect` that calls this method will also call "unuse"
    // which will mean the next time the `useEffect` calls here
    // we'll create a new reader in start.
    const reader = this.startQueryBrain(
      requestBearerTokenHash,
      serializedRequest,
      bearerToken,
      offlineCacheEnabled,
      cacheKey
    );

    reboot_api.assert(reader !== undefined);

    // Indicate that the reader has properly been used so that we don't
    // clean it up prematurely.
    reader.used = true;

    reader.setResponses[id] = setResponse;
    reader.setIsLoadings[id] = setIsLoading;
    reader.setStatuses[id] = setStatus;

    // If we already have a `response` or `status` need to set it.
    if (reader.response) {
      setResponse(reader.response);
      setIsLoading(false);
    } else if (reader.status) {
      setStatus(reader.status);
    }
  }

  unuseQueryBrain(
    id: string,
    requestBearerTokenHash: string,
  ) {
    const reader = this.useQueryBrainReaders[requestBearerTokenHash];

    reboot_api.assert(reader !== undefined);

    delete reader.setResponses[id];
    delete reader.setIsLoadings[id];
    delete reader.setStatuses[id];

    // Schedule a timeout to delete and abort this reader if we're the
    // last user. We need a timeout because, with StrictMode turned on,
    // we can't remove the reader right away otherwise we won't have a
    // stable Event and Promise. We use 3 seconds but may need to make
    // configurable depending on the application.
    if (Object.values(reader.setResponses).length === 0) {
      reader.scheduledUnusedTimeoutsCount += 1;
      setTimeout(() => {
        reader.scheduledUnusedTimeoutsCount -= 1;
        if (
          reader.scheduledUnusedTimeoutsCount === 0 &&
          Object.values(reader.setResponses).length === 0
        ) {
          delete this.useQueryBrainReaders[requestBearerTokenHash];
          reader.abortController.abort();
        }
      }, 3000);
    }
  }


  private useLiveStateReaders: {
    [requestBearerTokenHash: string]: reboot_react.Reader<loopos_pb.UserLiveStateResponse>
  } = {};

  private liveStateFinalizationRegistry =
    new FinalizationRegistry((finalize) => finalize());

  startLiveState(
    requestBearerTokenHash: string,
    serializedRequest: Uint8Array,
    bearerToken: string | undefined,
    offlineCacheEnabled: boolean,
    cacheKey: string | null
  ) {
    let reader = this.useLiveStateReaders[requestBearerTokenHash];

    if (reader === undefined) {
      const event = new reboot_api.Event();

      const promise = event.wait();

      reader = {
        abortController: new AbortController(),
        event,
        promise,
        used: false,
        scheduledUnusedTimeoutsCount: 0,
        setResponses: {},
        setIsLoadings: {},
        setStatuses: {},

        setResponse(
          response: loopos_pb.UserLiveStateResponse,
          { cache }: { cache: boolean } = { cache: true }
        ) {
          // Store the response, delete the status.
          this.response = response;
          delete this.status;

          // Trigger response or aborted has been received event (if
          // it wasn't triggered already).
          this.event.set();

          // Dispatch to all listeners.
          for (const setResponse of Object.values(this.setResponses)) {
            setResponse(response);
          }

          // Cache response if applicable.
          if (cache && offlineCacheEnabled) {
            reboot_api.assert(cacheKey !== null);
            const cachedResponse = response.toJsonString();
            reboot_web.offlineCache().set(cacheKey, cachedResponse)
              .catch((error) => {
                console.warn(
                  `[Reboot] Setting of offline reader cache entry for 'User.LiveState' errored with ${error}`
                );
              });
          }
        },

        setIsLoading(isLoading: boolean) {
          for (const setIsLoading of Object.values(this.setIsLoadings)) {
            setIsLoading(isLoading);
          }
        },

        setStatus(status: reboot_api.Status) {
          // Store the status, delete the response.
          this.status = status;
          delete this.response;

          // Trigger response or aborted has been received event (if
          // it wasn't triggered already).
          this.event.set();

          for (const setStatus of Object.values(this.setStatuses)) {
            setStatus(status);
          }
        },
      };

      this.liveStateFinalizationRegistry.register(
        promise,
        () => {
          if (!reader.used) {
            delete this.useLiveStateReaders[requestBearerTokenHash];
            reader.abortController.abort();
          }
        }
      );

      // We want to remove the promise so that it can be garbage collected
      // which is our indication that React is no longer using it. But this
      // races with calls to `useLiveState(...)`
      // that might be adding their `setResponse`, `setIsLoading`, etc, so
      // we delay deleting the promise for at least a second.
      //
      // Note that deleting the promise is okay because all subsequent calls
      // will simply use the `reader.response` since it will no longer be
      // undefined.
      reader.promise.then(async () => {
        // Allow the call to `useLiveState(...)`
        // at least 5 seconds to indicate that the reader is being used,
        // afterwhich, once `reader.promise` gets garbage collected
        // we'll know that it must have been abandoned by React, e.g.,
        // because the component was suspended and never committed.
        await reboot_api.sleep({ ms: 5000 });

        delete reader.promise;
      });

      this.useLiveStateReaders[requestBearerTokenHash] = reader;

      // Start fetching from the server.
      this.read(
        "LiveState",
        serializedRequest,
        bearerToken,
        loopos_pb.UserLiveStateResponse,
        reader
      );

      // Check if there is a cached result if applicable.
      if (offlineCacheEnabled) {
        reboot_api.assert(cacheKey !== null);

        reboot_web.offlineCache().get(cacheKey).then((cachedResponse) => {
          if (cachedResponse !== null) {
            // We only want to set the response if we haven't already
            // gotten a response from the server as it is the authority
            // and should take precedence.
            if (reader.response === undefined) {
              reader.setResponse(
                loopos_pb.UserLiveStateResponse.fromJsonString(cachedResponse),
                { cache: false } // Don't re-cache the value!
              );
            }
          }
        }).catch((error) => {
          console.warn(
            `[Reboot] Retrieval of offline reader cache entry for 'User.LiveState' errored with ${error}`
          );
        });
      }
    }

    reboot_api.assert(reader !== undefined);

    return reader;
  }

  useLiveState(
    id: string,
    requestBearerTokenHash: string,
    serializedRequest: Uint8Array,
    bearerToken: string | undefined,
    offlineCacheEnabled: boolean,
    cacheKey: string | null,
    setResponse: (response: loopos_pb.UserLiveStateResponse) => void,
    setIsLoading: (isLoading: boolean) => void,
    setStatus: (status: reboot_api.Status) => void
  ) {
    // We need to call start here because with strict mode the
    // `useEffect` that calls this method will also call "unuse"
    // which will mean the next time the `useEffect` calls here
    // we'll create a new reader in start.
    const reader = this.startLiveState(
      requestBearerTokenHash,
      serializedRequest,
      bearerToken,
      offlineCacheEnabled,
      cacheKey
    );

    reboot_api.assert(reader !== undefined);

    // Indicate that the reader has properly been used so that we don't
    // clean it up prematurely.
    reader.used = true;

    reader.setResponses[id] = setResponse;
    reader.setIsLoadings[id] = setIsLoading;
    reader.setStatuses[id] = setStatus;

    // If we already have a `response` or `status` need to set it.
    if (reader.response) {
      setResponse(reader.response);
      setIsLoading(false);
    } else if (reader.status) {
      setStatus(reader.status);
    }
  }

  unuseLiveState(
    id: string,
    requestBearerTokenHash: string,
  ) {
    const reader = this.useLiveStateReaders[requestBearerTokenHash];

    reboot_api.assert(reader !== undefined);

    delete reader.setResponses[id];
    delete reader.setIsLoadings[id];
    delete reader.setStatuses[id];

    // Schedule a timeout to delete and abort this reader if we're the
    // last user. We need a timeout because, with StrictMode turned on,
    // we can't remove the reader right away otherwise we won't have a
    // stable Event and Promise. We use 3 seconds but may need to make
    // configurable depending on the application.
    if (Object.values(reader.setResponses).length === 0) {
      reader.scheduledUnusedTimeoutsCount += 1;
      setTimeout(() => {
        reader.scheduledUnusedTimeoutsCount -= 1;
        if (
          reader.scheduledUnusedTimeoutsCount === 0 &&
          Object.values(reader.setResponses).length === 0
        ) {
          delete this.useLiveStateReaders[requestBearerTokenHash];
          reader.abortController.abort();
        }
      }, 3000);
    }
  }


  private useCostSummaryReaders: {
    [requestBearerTokenHash: string]: reboot_react.Reader<loopos_pb.UserCostSummaryResponse>
  } = {};

  private costSummaryFinalizationRegistry =
    new FinalizationRegistry((finalize) => finalize());

  startCostSummary(
    requestBearerTokenHash: string,
    serializedRequest: Uint8Array,
    bearerToken: string | undefined,
    offlineCacheEnabled: boolean,
    cacheKey: string | null
  ) {
    let reader = this.useCostSummaryReaders[requestBearerTokenHash];

    if (reader === undefined) {
      const event = new reboot_api.Event();

      const promise = event.wait();

      reader = {
        abortController: new AbortController(),
        event,
        promise,
        used: false,
        scheduledUnusedTimeoutsCount: 0,
        setResponses: {},
        setIsLoadings: {},
        setStatuses: {},

        setResponse(
          response: loopos_pb.UserCostSummaryResponse,
          { cache }: { cache: boolean } = { cache: true }
        ) {
          // Store the response, delete the status.
          this.response = response;
          delete this.status;

          // Trigger response or aborted has been received event (if
          // it wasn't triggered already).
          this.event.set();

          // Dispatch to all listeners.
          for (const setResponse of Object.values(this.setResponses)) {
            setResponse(response);
          }

          // Cache response if applicable.
          if (cache && offlineCacheEnabled) {
            reboot_api.assert(cacheKey !== null);
            const cachedResponse = response.toJsonString();
            reboot_web.offlineCache().set(cacheKey, cachedResponse)
              .catch((error) => {
                console.warn(
                  `[Reboot] Setting of offline reader cache entry for 'User.CostSummary' errored with ${error}`
                );
              });
          }
        },

        setIsLoading(isLoading: boolean) {
          for (const setIsLoading of Object.values(this.setIsLoadings)) {
            setIsLoading(isLoading);
          }
        },

        setStatus(status: reboot_api.Status) {
          // Store the status, delete the response.
          this.status = status;
          delete this.response;

          // Trigger response or aborted has been received event (if
          // it wasn't triggered already).
          this.event.set();

          for (const setStatus of Object.values(this.setStatuses)) {
            setStatus(status);
          }
        },
      };

      this.costSummaryFinalizationRegistry.register(
        promise,
        () => {
          if (!reader.used) {
            delete this.useCostSummaryReaders[requestBearerTokenHash];
            reader.abortController.abort();
          }
        }
      );

      // We want to remove the promise so that it can be garbage collected
      // which is our indication that React is no longer using it. But this
      // races with calls to `useCostSummary(...)`
      // that might be adding their `setResponse`, `setIsLoading`, etc, so
      // we delay deleting the promise for at least a second.
      //
      // Note that deleting the promise is okay because all subsequent calls
      // will simply use the `reader.response` since it will no longer be
      // undefined.
      reader.promise.then(async () => {
        // Allow the call to `useCostSummary(...)`
        // at least 5 seconds to indicate that the reader is being used,
        // afterwhich, once `reader.promise` gets garbage collected
        // we'll know that it must have been abandoned by React, e.g.,
        // because the component was suspended and never committed.
        await reboot_api.sleep({ ms: 5000 });

        delete reader.promise;
      });

      this.useCostSummaryReaders[requestBearerTokenHash] = reader;

      // Start fetching from the server.
      this.read(
        "CostSummary",
        serializedRequest,
        bearerToken,
        loopos_pb.UserCostSummaryResponse,
        reader
      );

      // Check if there is a cached result if applicable.
      if (offlineCacheEnabled) {
        reboot_api.assert(cacheKey !== null);

        reboot_web.offlineCache().get(cacheKey).then((cachedResponse) => {
          if (cachedResponse !== null) {
            // We only want to set the response if we haven't already
            // gotten a response from the server as it is the authority
            // and should take precedence.
            if (reader.response === undefined) {
              reader.setResponse(
                loopos_pb.UserCostSummaryResponse.fromJsonString(cachedResponse),
                { cache: false } // Don't re-cache the value!
              );
            }
          }
        }).catch((error) => {
          console.warn(
            `[Reboot] Retrieval of offline reader cache entry for 'User.CostSummary' errored with ${error}`
          );
        });
      }
    }

    reboot_api.assert(reader !== undefined);

    return reader;
  }

  useCostSummary(
    id: string,
    requestBearerTokenHash: string,
    serializedRequest: Uint8Array,
    bearerToken: string | undefined,
    offlineCacheEnabled: boolean,
    cacheKey: string | null,
    setResponse: (response: loopos_pb.UserCostSummaryResponse) => void,
    setIsLoading: (isLoading: boolean) => void,
    setStatus: (status: reboot_api.Status) => void
  ) {
    // We need to call start here because with strict mode the
    // `useEffect` that calls this method will also call "unuse"
    // which will mean the next time the `useEffect` calls here
    // we'll create a new reader in start.
    const reader = this.startCostSummary(
      requestBearerTokenHash,
      serializedRequest,
      bearerToken,
      offlineCacheEnabled,
      cacheKey
    );

    reboot_api.assert(reader !== undefined);

    // Indicate that the reader has properly been used so that we don't
    // clean it up prematurely.
    reader.used = true;

    reader.setResponses[id] = setResponse;
    reader.setIsLoadings[id] = setIsLoading;
    reader.setStatuses[id] = setStatus;

    // If we already have a `response` or `status` need to set it.
    if (reader.response) {
      setResponse(reader.response);
      setIsLoading(false);
    } else if (reader.status) {
      setStatus(reader.status);
    }
  }

  unuseCostSummary(
    id: string,
    requestBearerTokenHash: string,
  ) {
    const reader = this.useCostSummaryReaders[requestBearerTokenHash];

    reboot_api.assert(reader !== undefined);

    delete reader.setResponses[id];
    delete reader.setIsLoadings[id];
    delete reader.setStatuses[id];

    // Schedule a timeout to delete and abort this reader if we're the
    // last user. We need a timeout because, with StrictMode turned on,
    // we can't remove the reader right away otherwise we won't have a
    // stable Event and Promise. We use 3 seconds but may need to make
    // configurable depending on the application.
    if (Object.values(reader.setResponses).length === 0) {
      reader.scheduledUnusedTimeoutsCount += 1;
      setTimeout(() => {
        reader.scheduledUnusedTimeoutsCount -= 1;
        if (
          reader.scheduledUnusedTimeoutsCount === 0 &&
          Object.values(reader.setResponses).length === 0
        ) {
          delete this.useCostSummaryReaders[requestBearerTokenHash];
          reader.abortController.abort();
        }
      }, 3000);
    }
  }


  private useCreateMutations: (
    PendingUserCreateMutation)[] = [];

  private useCreateSetPendings: {
    [id: string]: (mutations: PendingUserCreateMutation[]) => void
  } = {};

  async create(
    mutation: PendingUserCreateMutation
  ): Promise<
    reboot_web.ResponseOrAborted<
      User.CreateResponse,
      UserCreateAborted
  >> {
    // We always have at least 1 observer which is this function!
    let remainingObservers = 1;

    const event = new reboot_api.Event();

    let callbacks: (() => void)[] = [];

    const observed = (callback: () => void) => {
      callbacks = callbacks.concat(callback);
      remainingObservers -= 1;
      if (remainingObservers === 0) {
        for (const callback of callbacks) {
          callback();
        }
        event.set();
      }
      return event.wait();
    };

    const aborted = () => {
      observed(() => {});
    }

    // Tell observers about this pending mutation.
    for (const id in this.observers) {
      remainingObservers += 1;
      this.observers[id].observe(mutation.idempotencyKey, observed, aborted);
    }

    this.useCreateMutations = this.useCreateMutations.concat(mutation);

    for (const setPending of Object.values(this.useCreateSetPendings)) {
      setPending(this.useCreateMutations);
    }

    return new Promise<
      reboot_web.ResponseOrAborted<
        User.CreateResponse,
        UserCreateAborted
      >>(
      async (resolve, reject) => {
        const { responseOrStatus } = await this.mutate(
          {
            method: "Create",
            request: mutation.request.toBinary(),
            idempotencyKey: mutation.idempotencyKey,
            bearerToken: mutation.bearerToken,
          },
          ({ isLoading, error }: { isLoading: boolean; error?: any }) => {
            let rerender = false;
            for (const m of this.useCreateMutations) {
              if (m === mutation) {
                if (m.isLoading !== isLoading) {
                  m.isLoading = isLoading;
                  rerender = true;
                }
                if (error !== undefined && m.error !== error) {
                  m.error = error;
                  rerender = true;
                }
              }
            }

            if (rerender) {
              for (const setPending of Object.values(this.useCreateSetPendings)) {
                setPending(this.useCreateMutations);
              }
            }
          }
        );

        const removeMutationsAndSetPending = () => {
          this.useCreateMutations =
            this.useCreateMutations.filter(m => m !== mutation);

          for (const setPending of Object.values(this.useCreateSetPendings)) {
            setPending(this.useCreateMutations);
          }
        }


        switch (responseOrStatus.case) {
          case "response": {
            await observed(() => {
              removeMutationsAndSetPending();
              resolve({
                response:
                  UserCreateResponseFromProtobufShape(
                    Empty.fromBinary(
                    responseOrStatus.value
                  )
                )
              });
            });
            break;
          }
          case "status": {
            // Let the observers know they no longer should expect to
            // observe this idempotency key.
            for (const id in this.observers) {
              this.observers[id].unobserve(mutation.idempotencyKey);
            }

            const status = reboot_api.Status.fromJsonString(responseOrStatus.value);

            const aborted = UserCreateAborted.fromStatus(status);

            console.warn(
              `[Reboot] 'User.Create' aborted with ${aborted.message}`
            );

            removeMutationsAndSetPending();
            resolve({ aborted });

            break;
          }
          default: {
            // TODO(benh): while this is a _really_ fatal error,
            // should we still set `aborted` instead of throwing?
            reject(new Error('Expecting either a response or a status'));
          }
        }
      });
  }

  useCreate(
    id: string,
    setPending: (mutations: PendingUserCreateMutation[]) => void
  ) {
    this.useCreateSetPendings[id] = setPending;
  }

  unuseCreate(id: string) {
    delete this.useCreateSetPendings[id];
  }


  private static instances: { [id: string]: UserInstance } = {};

  static use(id: string, stateRef: string, url: string) {
    if (!(id in this.instances)) {
      this.instances[id] = new UserInstance(id, stateRef, url);
    } else {
      this.instances[id].ref();
    }

    return this.instances[id];
  }

  unuse() {
    if (this.unref() === 0) {
      delete UserInstance.instances[this.id];
    }
  }
}


export const useUser = (
  { id: providedId }: { id?: string } = {}
): UseUserApi => {
  // Get mcpApp and tool input from context (RebootClientProvider).
  const mcpApp = useMcpApp();
  const mcpToolData = useMcpToolData();

  // Resolve ID: explicit > URL param (dev) > `ids` mapping.
  const devId = useMemo(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(
        window.location.search
      ).get("loopos.v1.User.id");
    }
    return null;
  }, []);

  const idsMap = mcpToolData?.ids as
    Record<string, string> | undefined;
  const toolInputId =
    typeof idsMap?.["loopos.v1.User"] === "string"
      ? idsMap["loopos.v1.User"]
      : null;

  const resolvedId = providedId ?? devId ?? toolInputId;
  if (!resolvedId) {
    throw new Error(
      "useUser: no state ID available. " +
      "Ensure this component is inside <RebootClientProvider>, " +
      "or pass id explicitly, or use " +
      "?loopos.v1.User.id=... URL param."
    );
  }
  const id = resolvedId;
  const stateRef = reboot_api.stateIdToRef(
    "loopos.v1.User",
    id,
  );

  const rebootClient = reboot_react.useRebootClient();

  const url = rebootClient.url;
  const bearerToken = rebootClient.bearerToken;
  const refreshMCPBearerToken = useRefreshMCPBearerToken();

  const [instance, setInstance] = useState(() => {
    return UserInstance.use(
      id, stateRef, url
    );
  });

  if (instance.id !== id) {
    setInstance(
      UserInstance.use(
        id, stateRef, url
      )
    );
  }

  useEffect(() => {
    return () => {
      instance.unuse();
    };
  }, [instance]);

  const headers = useMemo(() => {
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.append("Connection", "keep-alive");

    if (bearerToken !== undefined) {
      headers.append("Authorization", `Bearer ${bearerToken}`);
    }

    return headers;
  }, [bearerToken]);


  function useIngestTextMessage() {
    const [
      pending,
      setPending
    ] = useState<PendingUserIngestTextMessageMutation[]>([]);

    useEffect(() => {
      const id = uuidv4();
      instance.useIngestTextMessage(id, setPending);
      return () => {
        instance.unuseIngestTextMessage(id);
      };
    }, []);

    const rebootClient = reboot_react.useRebootClient();

    const bearerToken = rebootClient.bearerToken;

    const ingestTextMessage = useMemo(() => {
      const method = async (
        partialRequest: User.PartialIngestTextMessageRequest = {},
        options?: { metadata?: any, key?: string }
      ) => {
        const request = UserIngestTextMessageRequestToProtobuf(partialRequest);

        const idempotencyKey = options?.idempotencyKey ?? options?.key ?? reboot_web.makeExpiringIdempotencyKey();

        const mutation = {
          request,
          idempotencyKey,
          bearerToken,
          metadata: options?.metadata,
          isLoading: false, // Won't start loading if we're flushing mutations.
        };

        return instance.ingestTextMessage(mutation);
      };

      method.pending =
        new Array<PendingUserIngestTextMessageMutation>();

      return method;
    }, [instance, bearerToken, mcpApp, id]);

    ingestTextMessage.pending = pending;

    return ingestTextMessage;
  }

  const ingestTextMessage = useIngestTextMessage();


  function useIngestVoiceNote() {
    const [
      pending,
      setPending
    ] = useState<PendingUserIngestVoiceNoteMutation[]>([]);

    useEffect(() => {
      const id = uuidv4();
      instance.useIngestVoiceNote(id, setPending);
      return () => {
        instance.unuseIngestVoiceNote(id);
      };
    }, []);

    const rebootClient = reboot_react.useRebootClient();

    const bearerToken = rebootClient.bearerToken;

    const ingestVoiceNote = useMemo(() => {
      const method = async (
        partialRequest: User.PartialIngestVoiceNoteRequest = {},
        options?: { metadata?: any, key?: string }
      ) => {
        const request = UserIngestVoiceNoteRequestToProtobuf(partialRequest);

        const idempotencyKey = options?.idempotencyKey ?? options?.key ?? reboot_web.makeExpiringIdempotencyKey();

        const mutation = {
          request,
          idempotencyKey,
          bearerToken,
          metadata: options?.metadata,
          isLoading: false, // Won't start loading if we're flushing mutations.
        };

        return instance.ingestVoiceNote(mutation);
      };

      method.pending =
        new Array<PendingUserIngestVoiceNoteMutation>();

      return method;
    }, [instance, bearerToken, mcpApp, id]);

    ingestVoiceNote.pending = pending;

    return ingestVoiceNote;
  }

  const ingestVoiceNote = useIngestVoiceNote();



  function useListTickets(
    partialRequest: User.PartialListTicketsRequest = {},
    options: { suspense: boolean } = { suspense: false }
  ) {
    const newRequest = UserListTicketsRequestToProtobuf(partialRequest);

    const [request, setRequest] = useState(newRequest);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const rebootClient = reboot_react.useRebootClient();

    const bearerToken = rebootClient.bearerToken;

    const serializedRequest = useMemo(() => request.toBinary(), [request]);

    // To distinguish this call from others when caching responses on
    // the client we compute a "request hash" using SHA256 from the
    // `request`.
    // We memoize this so we don't do it every time.
    const requestHash: string = useMemo(
      () => {
        const hash = reboot_web.calcSha256();
        hash.add(serializedRequest);
        return hash.digest().hex();
      },
      [serializedRequest]
    );

    // To create a map of unused readers globally on the client, we
    // compute a "request hash" using SHA256 from the `request`
    // including the bearerToken.
    // We memoize this so we don't do it every time.
    const requestBearerTokenHash: string = useMemo(
      () => {
        const hash = reboot_web.calcSha256();
        hash.add(serializedRequest);
        if (bearerToken) {
          hash.add(bearerToken);
        }
        return hash.digest().hex();
      },
      [serializedRequest, bearerToken]
    );

    const offlineCacheEnabled = rebootClient.offlineCacheEnabled;

    const cacheKey: string | null = useMemo(
      () => {
        if (offlineCacheEnabled) {
          return `${stateRef}:ListTickets:${requestHash}`;
        }
        return null;
      },
      [stateRef, offlineCacheEnabled, requestHash]
    );

    // We start reading here, or if another component already started
    // the reading then we just get back the reader. We need to do this
    // before setting up our `useState`s because when using suspense
    // we need to use the `reader.response` or `reader.status` during
    // render where one of them will be defined, i.e., after we've
    // waited for `reader.promise` via `React.use()`.
    const reader = instance.startListTickets(
      requestBearerTokenHash,
      serializedRequest,
      bearerToken,
      offlineCacheEnabled,
      cacheKey
    );

    const [response, setResponse] = useState<
      User.ListTicketsResponse | undefined
      >(reader.response && UserListTicketsResponseFromProtobufShape(reader.response));

    const [aborted, setAborted] = useState<
      UserListTicketsAborted | undefined
      >(reader.status && UserListTicketsAborted.fromStatus(reader.status));

    // Track which state ID the current `response` and `aborted` belong
    // to so we can reset them when the state ID changes, back into
    // their "loading" state. We track `id` rather than `instance`
    // because `id` updates immediately from props, whereas `instance`
    // only updates later after a separate `setState`.
    const [responseStateId, setResponseStateId] = useState(id);
    if (responseStateId !== id) {
      setResponseStateId(id);
      setResponse(undefined);
      setAborted(undefined);
      setIsLoading(true);
    }

    useEffect(() => {
      const id = uuidv4();

      instance.useListTickets(
        id,
        requestBearerTokenHash,
        serializedRequest,
        bearerToken,
        offlineCacheEnabled,
        cacheKey,
        (response: loopos_pb.UserListTicketsResponse) => {
          setAborted(undefined);
          setResponse(UserListTicketsResponseFromProtobufShape(response));
        },
        setIsLoading,
        (status: reboot_api.Status) => {
          // If the server rejected us due to an expired
          // token, refresh via the MCP host. The token
          // change triggers a re-render and reconnect.
          if (
            status.code === reboot_api.StatusCode.UNAUTHENTICATED &&
            refreshMCPBearerToken
          ) {
            refreshMCPBearerToken();
          }

          const aborted = UserListTicketsAborted.fromStatus(status);

          console.warn(
            `[Reboot] 'User.ListTickets' aborted with ${aborted.message}`
          );

          setAborted(aborted);
          setResponse(undefined);
        },
      );

      return () => {
        instance.unuseListTickets(id, requestBearerTokenHash);
      };
    }, [
      instance,
      serializedRequest,
      requestBearerTokenHash,
      bearerToken,
      offlineCacheEnabled,
      cacheKey,
    ]);

    // If the user has requested suspense via `options.suspense` then
    // we need to use `useMemo` to create a stable promise to pass
    // to `React.use()`. This is important for two reasons:
    //
    // 1. `reader.promise` gets deleted after 5 seconds to
    //    allow GC-based detection of abandoned readers (via
    //    `FinalizationRegistry`), so we can't pass it directly
    //    on every render.
    //
    // 2. `React.use()` suspends at least once for each new
    //    promise it sees (to call `.then()`), so we must
    //    return the same promise across re-renders for a given
    //    reader.
    //
    // When suspense is not requested, or the reader's event is
    // already set (i.e., we have a response or aborted status),
    // we return a pre-resolved promise. Note that `React.use()`
    // will suspend at least once even for a pre-resolved promise
    // in order to set internal state on it, but on subsequent
    // renders it will recognize the same promise and return
    // without suspending.
	//
	// We need to store the suspense promise in a `useRef` so
	// that we can continually return it even if the reader is
	// changing due to things like the `bearerToken` changing,
	// however, we don't want to flicker the suspense fallback
	// when `bearerToken` changes after we've already received
	// a stable `response` (or `aborted`).
	const suspensePromiseRef = useRef(undefined);

    const suspensePromise = useMemo(
      () => {
	    if (suspensePromiseRef.current === undefined || (response === undefined && aborted === undefined)) {
          if (!options.suspense || reader.event.isSet()) {
		    suspensePromiseRef.current = Promise.resolve();
          } else {
            reboot_api.assert(reader.promise !== undefined);
			reboot_api.assert(response === undefined);
			reboot_api.assert(aborted === undefined);
            suspensePromiseRef.current = reader.promise.then(() => {});
          }
		}        
		return suspensePromiseRef.current;
      },
      [options.suspense, reader, response, aborted]
    );

    if (options.suspense) {
      if (!("use" in React)) {
        // Raise if it doesn't look like we are using React>=19.
        const error = "In order to pass `suspense: true` to a Reboot reactive reader you must be using React>=19 which provides `React.use`";
        console.error(error);
        throw new Error(error);
      }

      React.use(suspensePromise);
    }

    if (!request.equals(newRequest)) {
      setRequest(newRequest);
      setIsLoading(true);

      return { response, isLoading: true, aborted };
    }

    return { response, isLoading, aborted };
  }

  async function listTickets(
    partialRequest: User.PartialListTicketsRequest = {},
    options?: { signal?: AbortSignal; retry?: boolean }
  ) {
    let retry = true;
    if (options !== undefined && options.retry !== undefined) {
      retry = options.retry;
    }

    const request = UserListTicketsRequestToProtobuf(partialRequest);

    // Fetch with retry, using a backoff, i.e., if we get disconnected.
    const { response, aborted } = await (async () => {
      const backoff = new reboot_api.Backoff();

      while (true) {
        try {
          // Invariant here is that we use the '/package.service.method' path and
          // HTTP 'POST' method (we need 'POST' because we send an HTTP body).
          //
          // See also 'reboot/helpers.py'.
          return {
            response: await reboot_web.guardedFetch(
              new Request(
                `${rebootClient.url}/__/reboot/rpc/${stateRef}/loopos.v1.UserMethods/ListTickets`, {
                  method: "POST",
                  headers,
                  body: request.toJsonString()
                }
              ),
              options
            )
          };
        } catch (e: unknown) {
          if (options?.signal?.aborted || !retry) {
            const aborted = new UserListTicketsAborted(
              new reboot_api.errors_pb.Aborted(), {
                message: e instanceof Error
                  ? `${e}`
                  : `Unknown error: ${JSON.stringify(e)}`
              }
            );

            return { aborted };
          } else if (e instanceof Error) {
            console.error(e);
          } else {
            console.error(`[Reboot] Unknown error: ${JSON.stringify(e)}`);
          }
        }

        await backoff.wait(`[Reboot] Retrying call to \`loopos.v1.UserMethods.ListTickets\` with backoff...`);
      }
    })();

    if (aborted) {
      return { aborted };
    } else if (response.status === 401 && refreshMCPBearerToken) {
      // Token expired — refresh via MCP host and retry once.
      const newToken = await refreshMCPBearerToken();
      if (newToken) {
        const retryHeaders = new Headers();
        retryHeaders.set("Content-Type", "application/json");
        retryHeaders.append("Connection", "keep-alive");
        retryHeaders.append("Authorization", `Bearer ${newToken}`);
        try {
          const retryResponse = await reboot_web.guardedFetch(
            new Request(
              `${rebootClient.url}/__/reboot/rpc/${stateRef}/loopos.v1.UserMethods/ListTickets`, {
                method: "POST",
                headers: retryHeaders,
                body: request.toJsonString()
              }
            ),
            options
          );
          if (retryResponse.ok) {
            return {
              response:
                UserListTicketsResponseFromProtobufShape((loopos_pb.UserListTicketsResponse.fromJson(await retryResponse.json())))
            };
          }
          // Fall through to generic error handling on retry failure.
          return {
            aborted: new UserListTicketsAborted(
              new reboot_api.errors_pb.Unknown(), {
                message: `Unknown error with HTTP status ${retryResponse.status} after token refresh`
              }
            )
          };
        } catch (e: unknown) {
          return {
            aborted: new UserListTicketsAborted(
              new reboot_api.errors_pb.Aborted(), {
                message: e instanceof Error
                  ? `${e}`
                  : `Unknown error: ${JSON.stringify(e)}`
              }
            )
          };
        }
      }
      // Refresh failed — fall through to generic error.
      return {
        aborted: new UserListTicketsAborted(
          new reboot_api.errors_pb.Unknown(), {
            message: `Unauthorized (HTTP 401) and token refresh failed`
          }
        )
      };
    } else if (!response.ok) {
      if (response.headers.get("content-type") === "application/json") {
        const status = reboot_api.Status.fromJson(await response.json());


        // If the server rejected us due to an expired
        // token, refresh via the MCP host and retry once.
        if (
          status.code === reboot_api.StatusCode.UNAUTHENTICATED &&
          refreshMCPBearerToken
        ) {
          const newToken = await refreshMCPBearerToken();
          if (newToken) {
            const retryHeaders = new Headers();
            retryHeaders.set(
              "Content-Type", "application/json",
            );
            retryHeaders.append(
              "Connection", "keep-alive",
            );
            retryHeaders.append(
              "Authorization", `Bearer ${newToken}`,
            );
            try {
              const retryResponse =
                await reboot_web.guardedFetch(
                  new Request(
                    `${rebootClient.url}/__/reboot/rpc/${stateRef}/loopos.v1.UserMethods/ListTickets`, {
                      method: "POST",
                      headers: retryHeaders,
                      body: request.toJsonString()
                    }
                  ),
                  options
                );
              if (retryResponse.ok) {
                return {
                  response:
                    UserListTicketsResponseFromProtobufShape((loopos_pb.UserListTicketsResponse.fromJson(await retryResponse.json())))
                };
              }
            } catch {
              // Fall through to return the original
              // aborted error.
            }
          }
        }

        const aborted = UserListTicketsAborted.fromStatus(status);

        console.warn(
          `[Reboot] 'User.ListTickets' aborted with ${aborted.message}`
        );

        return { aborted };
      } else {
        const aborted = new UserListTicketsAborted(
          new reboot_api.errors_pb.Unknown(), {
            message: `Unknown error with HTTP status ${response.status}`
          }
        );

        return { aborted };
      }
    } else {
      return {
        response:
          UserListTicketsResponseFromProtobufShape((loopos_pb.UserListTicketsResponse.fromJson(await response.json())))
      };
    }
  }



  function useQueryBrain(
    partialRequest: User.PartialQueryBrainRequest = {},
    options: { suspense: boolean } = { suspense: false }
  ) {
    const newRequest = UserQueryBrainRequestToProtobuf(partialRequest);

    const [request, setRequest] = useState(newRequest);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const rebootClient = reboot_react.useRebootClient();

    const bearerToken = rebootClient.bearerToken;

    const serializedRequest = useMemo(() => request.toBinary(), [request]);

    // To distinguish this call from others when caching responses on
    // the client we compute a "request hash" using SHA256 from the
    // `request`.
    // We memoize this so we don't do it every time.
    const requestHash: string = useMemo(
      () => {
        const hash = reboot_web.calcSha256();
        hash.add(serializedRequest);
        return hash.digest().hex();
      },
      [serializedRequest]
    );

    // To create a map of unused readers globally on the client, we
    // compute a "request hash" using SHA256 from the `request`
    // including the bearerToken.
    // We memoize this so we don't do it every time.
    const requestBearerTokenHash: string = useMemo(
      () => {
        const hash = reboot_web.calcSha256();
        hash.add(serializedRequest);
        if (bearerToken) {
          hash.add(bearerToken);
        }
        return hash.digest().hex();
      },
      [serializedRequest, bearerToken]
    );

    const offlineCacheEnabled = rebootClient.offlineCacheEnabled;

    const cacheKey: string | null = useMemo(
      () => {
        if (offlineCacheEnabled) {
          return `${stateRef}:QueryBrain:${requestHash}`;
        }
        return null;
      },
      [stateRef, offlineCacheEnabled, requestHash]
    );

    // We start reading here, or if another component already started
    // the reading then we just get back the reader. We need to do this
    // before setting up our `useState`s because when using suspense
    // we need to use the `reader.response` or `reader.status` during
    // render where one of them will be defined, i.e., after we've
    // waited for `reader.promise` via `React.use()`.
    const reader = instance.startQueryBrain(
      requestBearerTokenHash,
      serializedRequest,
      bearerToken,
      offlineCacheEnabled,
      cacheKey
    );

    const [response, setResponse] = useState<
      User.QueryBrainResponse | undefined
      >(reader.response && UserQueryBrainResponseFromProtobufShape(reader.response));

    const [aborted, setAborted] = useState<
      UserQueryBrainAborted | undefined
      >(reader.status && UserQueryBrainAborted.fromStatus(reader.status));

    // Track which state ID the current `response` and `aborted` belong
    // to so we can reset them when the state ID changes, back into
    // their "loading" state. We track `id` rather than `instance`
    // because `id` updates immediately from props, whereas `instance`
    // only updates later after a separate `setState`.
    const [responseStateId, setResponseStateId] = useState(id);
    if (responseStateId !== id) {
      setResponseStateId(id);
      setResponse(undefined);
      setAborted(undefined);
      setIsLoading(true);
    }

    useEffect(() => {
      const id = uuidv4();

      instance.useQueryBrain(
        id,
        requestBearerTokenHash,
        serializedRequest,
        bearerToken,
        offlineCacheEnabled,
        cacheKey,
        (response: loopos_pb.UserQueryBrainResponse) => {
          setAborted(undefined);
          setResponse(UserQueryBrainResponseFromProtobufShape(response));
        },
        setIsLoading,
        (status: reboot_api.Status) => {
          // If the server rejected us due to an expired
          // token, refresh via the MCP host. The token
          // change triggers a re-render and reconnect.
          if (
            status.code === reboot_api.StatusCode.UNAUTHENTICATED &&
            refreshMCPBearerToken
          ) {
            refreshMCPBearerToken();
          }

          const aborted = UserQueryBrainAborted.fromStatus(status);

          console.warn(
            `[Reboot] 'User.QueryBrain' aborted with ${aborted.message}`
          );

          setAborted(aborted);
          setResponse(undefined);
        },
      );

      return () => {
        instance.unuseQueryBrain(id, requestBearerTokenHash);
      };
    }, [
      instance,
      serializedRequest,
      requestBearerTokenHash,
      bearerToken,
      offlineCacheEnabled,
      cacheKey,
    ]);

    // If the user has requested suspense via `options.suspense` then
    // we need to use `useMemo` to create a stable promise to pass
    // to `React.use()`. This is important for two reasons:
    //
    // 1. `reader.promise` gets deleted after 5 seconds to
    //    allow GC-based detection of abandoned readers (via
    //    `FinalizationRegistry`), so we can't pass it directly
    //    on every render.
    //
    // 2. `React.use()` suspends at least once for each new
    //    promise it sees (to call `.then()`), so we must
    //    return the same promise across re-renders for a given
    //    reader.
    //
    // When suspense is not requested, or the reader's event is
    // already set (i.e., we have a response or aborted status),
    // we return a pre-resolved promise. Note that `React.use()`
    // will suspend at least once even for a pre-resolved promise
    // in order to set internal state on it, but on subsequent
    // renders it will recognize the same promise and return
    // without suspending.
	//
	// We need to store the suspense promise in a `useRef` so
	// that we can continually return it even if the reader is
	// changing due to things like the `bearerToken` changing,
	// however, we don't want to flicker the suspense fallback
	// when `bearerToken` changes after we've already received
	// a stable `response` (or `aborted`).
	const suspensePromiseRef = useRef(undefined);

    const suspensePromise = useMemo(
      () => {
	    if (suspensePromiseRef.current === undefined || (response === undefined && aborted === undefined)) {
          if (!options.suspense || reader.event.isSet()) {
		    suspensePromiseRef.current = Promise.resolve();
          } else {
            reboot_api.assert(reader.promise !== undefined);
			reboot_api.assert(response === undefined);
			reboot_api.assert(aborted === undefined);
            suspensePromiseRef.current = reader.promise.then(() => {});
          }
		}        
		return suspensePromiseRef.current;
      },
      [options.suspense, reader, response, aborted]
    );

    if (options.suspense) {
      if (!("use" in React)) {
        // Raise if it doesn't look like we are using React>=19.
        const error = "In order to pass `suspense: true` to a Reboot reactive reader you must be using React>=19 which provides `React.use`";
        console.error(error);
        throw new Error(error);
      }

      React.use(suspensePromise);
    }

    if (!request.equals(newRequest)) {
      setRequest(newRequest);
      setIsLoading(true);

      return { response, isLoading: true, aborted };
    }

    return { response, isLoading, aborted };
  }

  async function queryBrain(
    partialRequest: User.PartialQueryBrainRequest = {},
    options?: { signal?: AbortSignal; retry?: boolean }
  ) {
    let retry = true;
    if (options !== undefined && options.retry !== undefined) {
      retry = options.retry;
    }

    const request = UserQueryBrainRequestToProtobuf(partialRequest);

    // Fetch with retry, using a backoff, i.e., if we get disconnected.
    const { response, aborted } = await (async () => {
      const backoff = new reboot_api.Backoff();

      while (true) {
        try {
          // Invariant here is that we use the '/package.service.method' path and
          // HTTP 'POST' method (we need 'POST' because we send an HTTP body).
          //
          // See also 'reboot/helpers.py'.
          return {
            response: await reboot_web.guardedFetch(
              new Request(
                `${rebootClient.url}/__/reboot/rpc/${stateRef}/loopos.v1.UserMethods/QueryBrain`, {
                  method: "POST",
                  headers,
                  body: request.toJsonString()
                }
              ),
              options
            )
          };
        } catch (e: unknown) {
          if (options?.signal?.aborted || !retry) {
            const aborted = new UserQueryBrainAborted(
              new reboot_api.errors_pb.Aborted(), {
                message: e instanceof Error
                  ? `${e}`
                  : `Unknown error: ${JSON.stringify(e)}`
              }
            );

            return { aborted };
          } else if (e instanceof Error) {
            console.error(e);
          } else {
            console.error(`[Reboot] Unknown error: ${JSON.stringify(e)}`);
          }
        }

        await backoff.wait(`[Reboot] Retrying call to \`loopos.v1.UserMethods.QueryBrain\` with backoff...`);
      }
    })();

    if (aborted) {
      return { aborted };
    } else if (response.status === 401 && refreshMCPBearerToken) {
      // Token expired — refresh via MCP host and retry once.
      const newToken = await refreshMCPBearerToken();
      if (newToken) {
        const retryHeaders = new Headers();
        retryHeaders.set("Content-Type", "application/json");
        retryHeaders.append("Connection", "keep-alive");
        retryHeaders.append("Authorization", `Bearer ${newToken}`);
        try {
          const retryResponse = await reboot_web.guardedFetch(
            new Request(
              `${rebootClient.url}/__/reboot/rpc/${stateRef}/loopos.v1.UserMethods/QueryBrain`, {
                method: "POST",
                headers: retryHeaders,
                body: request.toJsonString()
              }
            ),
            options
          );
          if (retryResponse.ok) {
            return {
              response:
                UserQueryBrainResponseFromProtobufShape((loopos_pb.UserQueryBrainResponse.fromJson(await retryResponse.json())))
            };
          }
          // Fall through to generic error handling on retry failure.
          return {
            aborted: new UserQueryBrainAborted(
              new reboot_api.errors_pb.Unknown(), {
                message: `Unknown error with HTTP status ${retryResponse.status} after token refresh`
              }
            )
          };
        } catch (e: unknown) {
          return {
            aborted: new UserQueryBrainAborted(
              new reboot_api.errors_pb.Aborted(), {
                message: e instanceof Error
                  ? `${e}`
                  : `Unknown error: ${JSON.stringify(e)}`
              }
            )
          };
        }
      }
      // Refresh failed — fall through to generic error.
      return {
        aborted: new UserQueryBrainAborted(
          new reboot_api.errors_pb.Unknown(), {
            message: `Unauthorized (HTTP 401) and token refresh failed`
          }
        )
      };
    } else if (!response.ok) {
      if (response.headers.get("content-type") === "application/json") {
        const status = reboot_api.Status.fromJson(await response.json());


        // If the server rejected us due to an expired
        // token, refresh via the MCP host and retry once.
        if (
          status.code === reboot_api.StatusCode.UNAUTHENTICATED &&
          refreshMCPBearerToken
        ) {
          const newToken = await refreshMCPBearerToken();
          if (newToken) {
            const retryHeaders = new Headers();
            retryHeaders.set(
              "Content-Type", "application/json",
            );
            retryHeaders.append(
              "Connection", "keep-alive",
            );
            retryHeaders.append(
              "Authorization", `Bearer ${newToken}`,
            );
            try {
              const retryResponse =
                await reboot_web.guardedFetch(
                  new Request(
                    `${rebootClient.url}/__/reboot/rpc/${stateRef}/loopos.v1.UserMethods/QueryBrain`, {
                      method: "POST",
                      headers: retryHeaders,
                      body: request.toJsonString()
                    }
                  ),
                  options
                );
              if (retryResponse.ok) {
                return {
                  response:
                    UserQueryBrainResponseFromProtobufShape((loopos_pb.UserQueryBrainResponse.fromJson(await retryResponse.json())))
                };
              }
            } catch {
              // Fall through to return the original
              // aborted error.
            }
          }
        }

        const aborted = UserQueryBrainAborted.fromStatus(status);

        console.warn(
          `[Reboot] 'User.QueryBrain' aborted with ${aborted.message}`
        );

        return { aborted };
      } else {
        const aborted = new UserQueryBrainAborted(
          new reboot_api.errors_pb.Unknown(), {
            message: `Unknown error with HTTP status ${response.status}`
          }
        );

        return { aborted };
      }
    } else {
      return {
        response:
          UserQueryBrainResponseFromProtobufShape((loopos_pb.UserQueryBrainResponse.fromJson(await response.json())))
      };
    }
  }



  function useLiveState(
    partialRequest: User.PartialLiveStateRequest = {},
    options: { suspense: boolean } = { suspense: false }
  ) {
    const newRequest = UserLiveStateRequestToProtobuf(partialRequest);

    const [request, setRequest] = useState(newRequest);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const rebootClient = reboot_react.useRebootClient();

    const bearerToken = rebootClient.bearerToken;

    const serializedRequest = useMemo(() => request.toBinary(), [request]);

    // To distinguish this call from others when caching responses on
    // the client we compute a "request hash" using SHA256 from the
    // `request`.
    // We memoize this so we don't do it every time.
    const requestHash: string = useMemo(
      () => {
        const hash = reboot_web.calcSha256();
        hash.add(serializedRequest);
        return hash.digest().hex();
      },
      [serializedRequest]
    );

    // To create a map of unused readers globally on the client, we
    // compute a "request hash" using SHA256 from the `request`
    // including the bearerToken.
    // We memoize this so we don't do it every time.
    const requestBearerTokenHash: string = useMemo(
      () => {
        const hash = reboot_web.calcSha256();
        hash.add(serializedRequest);
        if (bearerToken) {
          hash.add(bearerToken);
        }
        return hash.digest().hex();
      },
      [serializedRequest, bearerToken]
    );

    const offlineCacheEnabled = rebootClient.offlineCacheEnabled;

    const cacheKey: string | null = useMemo(
      () => {
        if (offlineCacheEnabled) {
          return `${stateRef}:LiveState:${requestHash}`;
        }
        return null;
      },
      [stateRef, offlineCacheEnabled, requestHash]
    );

    // We start reading here, or if another component already started
    // the reading then we just get back the reader. We need to do this
    // before setting up our `useState`s because when using suspense
    // we need to use the `reader.response` or `reader.status` during
    // render where one of them will be defined, i.e., after we've
    // waited for `reader.promise` via `React.use()`.
    const reader = instance.startLiveState(
      requestBearerTokenHash,
      serializedRequest,
      bearerToken,
      offlineCacheEnabled,
      cacheKey
    );

    const [response, setResponse] = useState<
      User.LiveStateResponse | undefined
      >(reader.response && UserLiveStateResponseFromProtobufShape(reader.response));

    const [aborted, setAborted] = useState<
      UserLiveStateAborted | undefined
      >(reader.status && UserLiveStateAborted.fromStatus(reader.status));

    // Track which state ID the current `response` and `aborted` belong
    // to so we can reset them when the state ID changes, back into
    // their "loading" state. We track `id` rather than `instance`
    // because `id` updates immediately from props, whereas `instance`
    // only updates later after a separate `setState`.
    const [responseStateId, setResponseStateId] = useState(id);
    if (responseStateId !== id) {
      setResponseStateId(id);
      setResponse(undefined);
      setAborted(undefined);
      setIsLoading(true);
    }

    useEffect(() => {
      const id = uuidv4();

      instance.useLiveState(
        id,
        requestBearerTokenHash,
        serializedRequest,
        bearerToken,
        offlineCacheEnabled,
        cacheKey,
        (response: loopos_pb.UserLiveStateResponse) => {
          setAborted(undefined);
          setResponse(UserLiveStateResponseFromProtobufShape(response));
        },
        setIsLoading,
        (status: reboot_api.Status) => {
          // If the server rejected us due to an expired
          // token, refresh via the MCP host. The token
          // change triggers a re-render and reconnect.
          if (
            status.code === reboot_api.StatusCode.UNAUTHENTICATED &&
            refreshMCPBearerToken
          ) {
            refreshMCPBearerToken();
          }

          const aborted = UserLiveStateAborted.fromStatus(status);

          console.warn(
            `[Reboot] 'User.LiveState' aborted with ${aborted.message}`
          );

          setAborted(aborted);
          setResponse(undefined);
        },
      );

      return () => {
        instance.unuseLiveState(id, requestBearerTokenHash);
      };
    }, [
      instance,
      serializedRequest,
      requestBearerTokenHash,
      bearerToken,
      offlineCacheEnabled,
      cacheKey,
    ]);

    // If the user has requested suspense via `options.suspense` then
    // we need to use `useMemo` to create a stable promise to pass
    // to `React.use()`. This is important for two reasons:
    //
    // 1. `reader.promise` gets deleted after 5 seconds to
    //    allow GC-based detection of abandoned readers (via
    //    `FinalizationRegistry`), so we can't pass it directly
    //    on every render.
    //
    // 2. `React.use()` suspends at least once for each new
    //    promise it sees (to call `.then()`), so we must
    //    return the same promise across re-renders for a given
    //    reader.
    //
    // When suspense is not requested, or the reader's event is
    // already set (i.e., we have a response or aborted status),
    // we return a pre-resolved promise. Note that `React.use()`
    // will suspend at least once even for a pre-resolved promise
    // in order to set internal state on it, but on subsequent
    // renders it will recognize the same promise and return
    // without suspending.
	//
	// We need to store the suspense promise in a `useRef` so
	// that we can continually return it even if the reader is
	// changing due to things like the `bearerToken` changing,
	// however, we don't want to flicker the suspense fallback
	// when `bearerToken` changes after we've already received
	// a stable `response` (or `aborted`).
	const suspensePromiseRef = useRef(undefined);

    const suspensePromise = useMemo(
      () => {
	    if (suspensePromiseRef.current === undefined || (response === undefined && aborted === undefined)) {
          if (!options.suspense || reader.event.isSet()) {
		    suspensePromiseRef.current = Promise.resolve();
          } else {
            reboot_api.assert(reader.promise !== undefined);
			reboot_api.assert(response === undefined);
			reboot_api.assert(aborted === undefined);
            suspensePromiseRef.current = reader.promise.then(() => {});
          }
		}        
		return suspensePromiseRef.current;
      },
      [options.suspense, reader, response, aborted]
    );

    if (options.suspense) {
      if (!("use" in React)) {
        // Raise if it doesn't look like we are using React>=19.
        const error = "In order to pass `suspense: true` to a Reboot reactive reader you must be using React>=19 which provides `React.use`";
        console.error(error);
        throw new Error(error);
      }

      React.use(suspensePromise);
    }

    if (!request.equals(newRequest)) {
      setRequest(newRequest);
      setIsLoading(true);

      return { response, isLoading: true, aborted };
    }

    return { response, isLoading, aborted };
  }

  async function liveState(
    partialRequest: User.PartialLiveStateRequest = {},
    options?: { signal?: AbortSignal; retry?: boolean }
  ) {
    let retry = true;
    if (options !== undefined && options.retry !== undefined) {
      retry = options.retry;
    }

    const request = UserLiveStateRequestToProtobuf(partialRequest);

    // Fetch with retry, using a backoff, i.e., if we get disconnected.
    const { response, aborted } = await (async () => {
      const backoff = new reboot_api.Backoff();

      while (true) {
        try {
          // Invariant here is that we use the '/package.service.method' path and
          // HTTP 'POST' method (we need 'POST' because we send an HTTP body).
          //
          // See also 'reboot/helpers.py'.
          return {
            response: await reboot_web.guardedFetch(
              new Request(
                `${rebootClient.url}/__/reboot/rpc/${stateRef}/loopos.v1.UserMethods/LiveState`, {
                  method: "POST",
                  headers,
                  body: request.toJsonString()
                }
              ),
              options
            )
          };
        } catch (e: unknown) {
          if (options?.signal?.aborted || !retry) {
            const aborted = new UserLiveStateAborted(
              new reboot_api.errors_pb.Aborted(), {
                message: e instanceof Error
                  ? `${e}`
                  : `Unknown error: ${JSON.stringify(e)}`
              }
            );

            return { aborted };
          } else if (e instanceof Error) {
            console.error(e);
          } else {
            console.error(`[Reboot] Unknown error: ${JSON.stringify(e)}`);
          }
        }

        await backoff.wait(`[Reboot] Retrying call to \`loopos.v1.UserMethods.LiveState\` with backoff...`);
      }
    })();

    if (aborted) {
      return { aborted };
    } else if (response.status === 401 && refreshMCPBearerToken) {
      // Token expired — refresh via MCP host and retry once.
      const newToken = await refreshMCPBearerToken();
      if (newToken) {
        const retryHeaders = new Headers();
        retryHeaders.set("Content-Type", "application/json");
        retryHeaders.append("Connection", "keep-alive");
        retryHeaders.append("Authorization", `Bearer ${newToken}`);
        try {
          const retryResponse = await reboot_web.guardedFetch(
            new Request(
              `${rebootClient.url}/__/reboot/rpc/${stateRef}/loopos.v1.UserMethods/LiveState`, {
                method: "POST",
                headers: retryHeaders,
                body: request.toJsonString()
              }
            ),
            options
          );
          if (retryResponse.ok) {
            return {
              response:
                UserLiveStateResponseFromProtobufShape((loopos_pb.UserLiveStateResponse.fromJson(await retryResponse.json())))
            };
          }
          // Fall through to generic error handling on retry failure.
          return {
            aborted: new UserLiveStateAborted(
              new reboot_api.errors_pb.Unknown(), {
                message: `Unknown error with HTTP status ${retryResponse.status} after token refresh`
              }
            )
          };
        } catch (e: unknown) {
          return {
            aborted: new UserLiveStateAborted(
              new reboot_api.errors_pb.Aborted(), {
                message: e instanceof Error
                  ? `${e}`
                  : `Unknown error: ${JSON.stringify(e)}`
              }
            )
          };
        }
      }
      // Refresh failed — fall through to generic error.
      return {
        aborted: new UserLiveStateAborted(
          new reboot_api.errors_pb.Unknown(), {
            message: `Unauthorized (HTTP 401) and token refresh failed`
          }
        )
      };
    } else if (!response.ok) {
      if (response.headers.get("content-type") === "application/json") {
        const status = reboot_api.Status.fromJson(await response.json());


        // If the server rejected us due to an expired
        // token, refresh via the MCP host and retry once.
        if (
          status.code === reboot_api.StatusCode.UNAUTHENTICATED &&
          refreshMCPBearerToken
        ) {
          const newToken = await refreshMCPBearerToken();
          if (newToken) {
            const retryHeaders = new Headers();
            retryHeaders.set(
              "Content-Type", "application/json",
            );
            retryHeaders.append(
              "Connection", "keep-alive",
            );
            retryHeaders.append(
              "Authorization", `Bearer ${newToken}`,
            );
            try {
              const retryResponse =
                await reboot_web.guardedFetch(
                  new Request(
                    `${rebootClient.url}/__/reboot/rpc/${stateRef}/loopos.v1.UserMethods/LiveState`, {
                      method: "POST",
                      headers: retryHeaders,
                      body: request.toJsonString()
                    }
                  ),
                  options
                );
              if (retryResponse.ok) {
                return {
                  response:
                    UserLiveStateResponseFromProtobufShape((loopos_pb.UserLiveStateResponse.fromJson(await retryResponse.json())))
                };
              }
            } catch {
              // Fall through to return the original
              // aborted error.
            }
          }
        }

        const aborted = UserLiveStateAborted.fromStatus(status);

        console.warn(
          `[Reboot] 'User.LiveState' aborted with ${aborted.message}`
        );

        return { aborted };
      } else {
        const aborted = new UserLiveStateAborted(
          new reboot_api.errors_pb.Unknown(), {
            message: `Unknown error with HTTP status ${response.status}`
          }
        );

        return { aborted };
      }
    } else {
      return {
        response:
          UserLiveStateResponseFromProtobufShape((loopos_pb.UserLiveStateResponse.fromJson(await response.json())))
      };
    }
  }



  function useCostSummary(
    partialRequest: User.PartialCostSummaryRequest = {},
    options: { suspense: boolean } = { suspense: false }
  ) {
    const newRequest = UserCostSummaryRequestToProtobuf(partialRequest);

    const [request, setRequest] = useState(newRequest);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const rebootClient = reboot_react.useRebootClient();

    const bearerToken = rebootClient.bearerToken;

    const serializedRequest = useMemo(() => request.toBinary(), [request]);

    // To distinguish this call from others when caching responses on
    // the client we compute a "request hash" using SHA256 from the
    // `request`.
    // We memoize this so we don't do it every time.
    const requestHash: string = useMemo(
      () => {
        const hash = reboot_web.calcSha256();
        hash.add(serializedRequest);
        return hash.digest().hex();
      },
      [serializedRequest]
    );

    // To create a map of unused readers globally on the client, we
    // compute a "request hash" using SHA256 from the `request`
    // including the bearerToken.
    // We memoize this so we don't do it every time.
    const requestBearerTokenHash: string = useMemo(
      () => {
        const hash = reboot_web.calcSha256();
        hash.add(serializedRequest);
        if (bearerToken) {
          hash.add(bearerToken);
        }
        return hash.digest().hex();
      },
      [serializedRequest, bearerToken]
    );

    const offlineCacheEnabled = rebootClient.offlineCacheEnabled;

    const cacheKey: string | null = useMemo(
      () => {
        if (offlineCacheEnabled) {
          return `${stateRef}:CostSummary:${requestHash}`;
        }
        return null;
      },
      [stateRef, offlineCacheEnabled, requestHash]
    );

    // We start reading here, or if another component already started
    // the reading then we just get back the reader. We need to do this
    // before setting up our `useState`s because when using suspense
    // we need to use the `reader.response` or `reader.status` during
    // render where one of them will be defined, i.e., after we've
    // waited for `reader.promise` via `React.use()`.
    const reader = instance.startCostSummary(
      requestBearerTokenHash,
      serializedRequest,
      bearerToken,
      offlineCacheEnabled,
      cacheKey
    );

    const [response, setResponse] = useState<
      User.CostSummaryResponse | undefined
      >(reader.response && UserCostSummaryResponseFromProtobufShape(reader.response));

    const [aborted, setAborted] = useState<
      UserCostSummaryAborted | undefined
      >(reader.status && UserCostSummaryAborted.fromStatus(reader.status));

    // Track which state ID the current `response` and `aborted` belong
    // to so we can reset them when the state ID changes, back into
    // their "loading" state. We track `id` rather than `instance`
    // because `id` updates immediately from props, whereas `instance`
    // only updates later after a separate `setState`.
    const [responseStateId, setResponseStateId] = useState(id);
    if (responseStateId !== id) {
      setResponseStateId(id);
      setResponse(undefined);
      setAborted(undefined);
      setIsLoading(true);
    }

    useEffect(() => {
      const id = uuidv4();

      instance.useCostSummary(
        id,
        requestBearerTokenHash,
        serializedRequest,
        bearerToken,
        offlineCacheEnabled,
        cacheKey,
        (response: loopos_pb.UserCostSummaryResponse) => {
          setAborted(undefined);
          setResponse(UserCostSummaryResponseFromProtobufShape(response));
        },
        setIsLoading,
        (status: reboot_api.Status) => {
          // If the server rejected us due to an expired
          // token, refresh via the MCP host. The token
          // change triggers a re-render and reconnect.
          if (
            status.code === reboot_api.StatusCode.UNAUTHENTICATED &&
            refreshMCPBearerToken
          ) {
            refreshMCPBearerToken();
          }

          const aborted = UserCostSummaryAborted.fromStatus(status);

          console.warn(
            `[Reboot] 'User.CostSummary' aborted with ${aborted.message}`
          );

          setAborted(aborted);
          setResponse(undefined);
        },
      );

      return () => {
        instance.unuseCostSummary(id, requestBearerTokenHash);
      };
    }, [
      instance,
      serializedRequest,
      requestBearerTokenHash,
      bearerToken,
      offlineCacheEnabled,
      cacheKey,
    ]);

    // If the user has requested suspense via `options.suspense` then
    // we need to use `useMemo` to create a stable promise to pass
    // to `React.use()`. This is important for two reasons:
    //
    // 1. `reader.promise` gets deleted after 5 seconds to
    //    allow GC-based detection of abandoned readers (via
    //    `FinalizationRegistry`), so we can't pass it directly
    //    on every render.
    //
    // 2. `React.use()` suspends at least once for each new
    //    promise it sees (to call `.then()`), so we must
    //    return the same promise across re-renders for a given
    //    reader.
    //
    // When suspense is not requested, or the reader's event is
    // already set (i.e., we have a response or aborted status),
    // we return a pre-resolved promise. Note that `React.use()`
    // will suspend at least once even for a pre-resolved promise
    // in order to set internal state on it, but on subsequent
    // renders it will recognize the same promise and return
    // without suspending.
	//
	// We need to store the suspense promise in a `useRef` so
	// that we can continually return it even if the reader is
	// changing due to things like the `bearerToken` changing,
	// however, we don't want to flicker the suspense fallback
	// when `bearerToken` changes after we've already received
	// a stable `response` (or `aborted`).
	const suspensePromiseRef = useRef(undefined);

    const suspensePromise = useMemo(
      () => {
	    if (suspensePromiseRef.current === undefined || (response === undefined && aborted === undefined)) {
          if (!options.suspense || reader.event.isSet()) {
		    suspensePromiseRef.current = Promise.resolve();
          } else {
            reboot_api.assert(reader.promise !== undefined);
			reboot_api.assert(response === undefined);
			reboot_api.assert(aborted === undefined);
            suspensePromiseRef.current = reader.promise.then(() => {});
          }
		}        
		return suspensePromiseRef.current;
      },
      [options.suspense, reader, response, aborted]
    );

    if (options.suspense) {
      if (!("use" in React)) {
        // Raise if it doesn't look like we are using React>=19.
        const error = "In order to pass `suspense: true` to a Reboot reactive reader you must be using React>=19 which provides `React.use`";
        console.error(error);
        throw new Error(error);
      }

      React.use(suspensePromise);
    }

    if (!request.equals(newRequest)) {
      setRequest(newRequest);
      setIsLoading(true);

      return { response, isLoading: true, aborted };
    }

    return { response, isLoading, aborted };
  }

  async function costSummary(
    partialRequest: User.PartialCostSummaryRequest = {},
    options?: { signal?: AbortSignal; retry?: boolean }
  ) {
    let retry = true;
    if (options !== undefined && options.retry !== undefined) {
      retry = options.retry;
    }

    const request = UserCostSummaryRequestToProtobuf(partialRequest);

    // Fetch with retry, using a backoff, i.e., if we get disconnected.
    const { response, aborted } = await (async () => {
      const backoff = new reboot_api.Backoff();

      while (true) {
        try {
          // Invariant here is that we use the '/package.service.method' path and
          // HTTP 'POST' method (we need 'POST' because we send an HTTP body).
          //
          // See also 'reboot/helpers.py'.
          return {
            response: await reboot_web.guardedFetch(
              new Request(
                `${rebootClient.url}/__/reboot/rpc/${stateRef}/loopos.v1.UserMethods/CostSummary`, {
                  method: "POST",
                  headers,
                  body: request.toJsonString()
                }
              ),
              options
            )
          };
        } catch (e: unknown) {
          if (options?.signal?.aborted || !retry) {
            const aborted = new UserCostSummaryAborted(
              new reboot_api.errors_pb.Aborted(), {
                message: e instanceof Error
                  ? `${e}`
                  : `Unknown error: ${JSON.stringify(e)}`
              }
            );

            return { aborted };
          } else if (e instanceof Error) {
            console.error(e);
          } else {
            console.error(`[Reboot] Unknown error: ${JSON.stringify(e)}`);
          }
        }

        await backoff.wait(`[Reboot] Retrying call to \`loopos.v1.UserMethods.CostSummary\` with backoff...`);
      }
    })();

    if (aborted) {
      return { aborted };
    } else if (response.status === 401 && refreshMCPBearerToken) {
      // Token expired — refresh via MCP host and retry once.
      const newToken = await refreshMCPBearerToken();
      if (newToken) {
        const retryHeaders = new Headers();
        retryHeaders.set("Content-Type", "application/json");
        retryHeaders.append("Connection", "keep-alive");
        retryHeaders.append("Authorization", `Bearer ${newToken}`);
        try {
          const retryResponse = await reboot_web.guardedFetch(
            new Request(
              `${rebootClient.url}/__/reboot/rpc/${stateRef}/loopos.v1.UserMethods/CostSummary`, {
                method: "POST",
                headers: retryHeaders,
                body: request.toJsonString()
              }
            ),
            options
          );
          if (retryResponse.ok) {
            return {
              response:
                UserCostSummaryResponseFromProtobufShape((loopos_pb.UserCostSummaryResponse.fromJson(await retryResponse.json())))
            };
          }
          // Fall through to generic error handling on retry failure.
          return {
            aborted: new UserCostSummaryAborted(
              new reboot_api.errors_pb.Unknown(), {
                message: `Unknown error with HTTP status ${retryResponse.status} after token refresh`
              }
            )
          };
        } catch (e: unknown) {
          return {
            aborted: new UserCostSummaryAborted(
              new reboot_api.errors_pb.Aborted(), {
                message: e instanceof Error
                  ? `${e}`
                  : `Unknown error: ${JSON.stringify(e)}`
              }
            )
          };
        }
      }
      // Refresh failed — fall through to generic error.
      return {
        aborted: new UserCostSummaryAborted(
          new reboot_api.errors_pb.Unknown(), {
            message: `Unauthorized (HTTP 401) and token refresh failed`
          }
        )
      };
    } else if (!response.ok) {
      if (response.headers.get("content-type") === "application/json") {
        const status = reboot_api.Status.fromJson(await response.json());


        // If the server rejected us due to an expired
        // token, refresh via the MCP host and retry once.
        if (
          status.code === reboot_api.StatusCode.UNAUTHENTICATED &&
          refreshMCPBearerToken
        ) {
          const newToken = await refreshMCPBearerToken();
          if (newToken) {
            const retryHeaders = new Headers();
            retryHeaders.set(
              "Content-Type", "application/json",
            );
            retryHeaders.append(
              "Connection", "keep-alive",
            );
            retryHeaders.append(
              "Authorization", `Bearer ${newToken}`,
            );
            try {
              const retryResponse =
                await reboot_web.guardedFetch(
                  new Request(
                    `${rebootClient.url}/__/reboot/rpc/${stateRef}/loopos.v1.UserMethods/CostSummary`, {
                      method: "POST",
                      headers: retryHeaders,
                      body: request.toJsonString()
                    }
                  ),
                  options
                );
              if (retryResponse.ok) {
                return {
                  response:
                    UserCostSummaryResponseFromProtobufShape((loopos_pb.UserCostSummaryResponse.fromJson(await retryResponse.json())))
                };
              }
            } catch {
              // Fall through to return the original
              // aborted error.
            }
          }
        }

        const aborted = UserCostSummaryAborted.fromStatus(status);

        console.warn(
          `[Reboot] 'User.CostSummary' aborted with ${aborted.message}`
        );

        return { aborted };
      } else {
        const aborted = new UserCostSummaryAborted(
          new reboot_api.errors_pb.Unknown(), {
            message: `Unknown error with HTTP status ${response.status}`
          }
        );

        return { aborted };
      }
    } else {
      return {
        response:
          UserCostSummaryResponseFromProtobufShape((loopos_pb.UserCostSummaryResponse.fromJson(await response.json())))
      };
    }
  }


  function useCreate() {
    const [
      pending,
      setPending
    ] = useState<PendingUserCreateMutation[]>([]);

    useEffect(() => {
      const id = uuidv4();
      instance.useCreate(id, setPending);
      return () => {
        instance.unuseCreate(id);
      };
    }, []);

    const rebootClient = reboot_react.useRebootClient();

    const bearerToken = rebootClient.bearerToken;

    const create = useMemo(() => {
      const method = async (
        partialRequest: User.PartialCreateRequest = {},
        options?: { metadata?: any, key?: string }
      ) => {
        const request = UserCreateRequestToProtobuf(partialRequest);

        const idempotencyKey = options?.idempotencyKey ?? options?.key ?? reboot_web.makeExpiringIdempotencyKey();

        const mutation = {
          request,
          idempotencyKey,
          bearerToken,
          metadata: options?.metadata,
          isLoading: false, // Won't start loading if we're flushing mutations.
        };

        return instance.create(mutation);
      };

      method.pending =
        new Array<PendingUserCreateMutation>();

      return method;
    }, [instance, bearerToken]);

    create.pending = pending;

    return create;
  }

  const create = useCreate();


  // Don't re-render if `id` hasn't changed.
    return useMemo(() => ({
      mutators: {
        ingestTextMessage,
        ingestVoiceNote,
        create,
      },
      idempotently: ({ key }: { key: string }) => {
      return {
        ingestTextMessage: (
          partialRequest?:User.PartialIngestTextMessageRequest,
          options?: { metadata?: any }
        ) => ingestTextMessage(partialRequest, { ...options, key }),
        ingestVoiceNote: (
          partialRequest?:User.PartialIngestVoiceNoteRequest,
          options?: { metadata?: any }
        ) => ingestVoiceNote(partialRequest, { ...options, key }),
        create: (
          partialRequest?:User.PartialCreateRequest,
          options?: { metadata?: any }
        ) => create(partialRequest, { ...options, key }),
      };
    },
      ingestTextMessage,
      ingestVoiceNote,
      listTickets,
      useListTickets,
      queryBrain,
      useQueryBrain,
      liveState,
      useLiveState,
      costSummary,
      useCostSummary,
      create,
    }), [id, instance, bearerToken]);
};



export class User {
  static State = UserProto;
}
export namespace User {
  export type State = UserProto;
}


