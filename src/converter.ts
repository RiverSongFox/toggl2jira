import { CSVRecord } from "./csv";
import { computeDuration, Duration, formatDate, formatDuration, toDateTime } from "./datetime";

export type TogglEntry = {
  issueKey: string,
  start: Date,
  end: Date,
}

export type WorklogEntry = {
  issueKey: string,
  dateStarted: Date,
  timeSpent: Duration,
}

export function parseTogglEntry(record: CSVRecord): TogglEntry | null {
  const {groups} = /^(?<issueKey>[^-]+-\d+)/.exec(record.description) ?? {}
  const issueKey = groups ? groups.issueKey : undefined

  if (!issueKey) {
    return null
  }

  return {
    issueKey,
    start: toDateTime(record.startDate, record.startTime),
    end: toDateTime(record.endDate, record.endTime),
  }
}

export function convertTogglEntryToWorklog(entry: TogglEntry): WorklogEntry {
  return {
    issueKey: entry.issueKey,
    dateStarted: entry.start,
    timeSpent: computeDuration(entry.start, entry.end),
  }
}

export function stringifyWorklogEntry(worklog: WorklogEntry): CSVRecord {
  return {
    issueKey: worklog.issueKey,
    dateStarted: formatDate(worklog.dateStarted),
    timeSpent: formatDuration(worklog.timeSpent),
  }
}
