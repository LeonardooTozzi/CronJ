# Kafka connectivity tester for CronJ

This small project helper checks TCP connectivity from the host running the app to the Kafka brokers configured for the project.

Files added:
- `scripts/connectivity_tester.js` — Node script that attempts a TCP connection to each broker in `KAFKA_BROKERS`.
- `.env.example` — sample environment variables for Kafka client configuration.

Usage (PowerShell):

1. Set environment variables (temporary, for the current shell):

```powershell
$env:KAFKA_BROKERS = '127.0.0.1:9092'
$env:CONNECT_TIMEOUT = '3000'
node scripts\connectivity_tester.js
```

2. Or using `.env` (if you use a tool to load env files) copy `.env.example` to `.env` and set values.

Interpreting results:
- `OK - host:port (tcp) — XXms` means the TCP connect succeeded.
- `FAIL - host:port (tcp) — <error>` means the client could not establish a TCP connection; common reasons:
  - broker host/port incorrect or not listening
  - firewall blocking the port
  - Docker networking mismatch (container not exposed to host)
  - DNS name not resolvable from this host

Quick Windows checks (PowerShell):

```powershell
Test-NetConnection -ComputerName 127.0.0.1 -Port 9092
```

If you run Kafka inside Docker Compose, make sure `KAFKA_ADVERTISED_LISTENERS` is set so clients outside the Docker network can reach it (commonly a source of `Connection timeout`).

If you want, I can also add SASL/SSL environment wiring and a small script to attempt Kafka-level metadata fetch using kafkajs (requires proper credentials/ssl files).
