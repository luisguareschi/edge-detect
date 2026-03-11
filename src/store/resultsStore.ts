/**
 * In-memory store for saved detection results.
 * Used by the Results screen to display captured snapshots.
 */

import type { SavedResult } from "@/types/detection";

let results: SavedResult[] = [];
let idCounter = 0;

function generateId(): string {
  idCounter += 1;
  return `result-${Date.now()}-${idCounter}`;
}

export function addResult(result: Omit<SavedResult, "id">): SavedResult {
  const full: SavedResult = { ...result, id: generateId() };
  results = [full, ...results];
  return full;
}

export function getResults(): SavedResult[] {
  return [...results];
}

export function clearResults(): void {
  results = [];
}
