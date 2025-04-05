interface Status {
  color: string;
  description: string;
}

interface Group {
  id: number;
  name: string;
}

interface Application {
  id: number;
  name: string;
}

interface Interface {
  id: number;
  name: string;
  status: string;
  status_description: string;
}

interface Admin {
  id: number;
  name: string;
  email: string;
}

interface Metric {
  datetime: string;
  cpu: number;
  memory: number;
  disk: number;
}

interface LastMetric {
  datetime: string;
  cpu: number;
  memory: number;
  disk: number;
}

interface Node {
  id: number;
  name: string;
  status: Status;
  groups: Group[];
  applications: Application[];
  interfaces: Interface[];
  admin: Admin;
  metrics: Metric[];
  last_metrics: LastMetric;
}
