/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Source {
  title: string;
  uri: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string; // ISO date string
  sources?: Source[];
  pendingActions?: { id: string; action: string; value: any; label: string }[];
  actionStatus?: "pending" | "approved" | "rejected";
  attachment?: {
    name: string;
    size: number;
    type: string;
    dataUrl?: string;
  };
}

export interface AgentConfig {
  name: string;
  role: string;
  temperature: number;
  model: string;
  grounding: boolean;
  avatarSeed: string; // Used to generate distinct UI placeholder icons
  avatarUrl?: string; // Optional custom avatar image (base64 or URL)
}

export interface AgentPreset {
  id: string;
  name: string;
  title: string;
  description: string;
  role: string;
  temperature: number;
  model: string;
  grounding: boolean;
  avatarSeed: string;
  avatarUrl?: string; // Optional custom avatar image (base64 or URL)
}
