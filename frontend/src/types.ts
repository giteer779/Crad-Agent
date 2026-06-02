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
}

export interface AgentConfig {
  name: string;
  role: string;
  temperature: number;
  model: "gemini-3.5-flash" | "gemini-3.1-pro-preview";
  grounding: boolean;
  avatarSeed: string; // Used to generate distinct UI placeholder icons
}

export interface AgentPreset {
  id: string;
  name: string;
  title: string;
  description: string;
  role: string;
  temperature: number;
  model: "gemini-3.5-flash" | "gemini-3.1-pro-preview";
  grounding: boolean;
  avatarSeed: string;
}
