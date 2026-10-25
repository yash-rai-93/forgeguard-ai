# sitework-ai: Evidence Notes

Companion to `sitework-ai.md`. Labels: Confirmed, Ran it, Per the docs, My reading, Ask the author, Author says. Repository paths are relative to the clone. Clone head: 8b8c48a (2026-10-19). The old explainer file inside the clone and the earlier partial explainer were not read; the earlier partial explainer and evidence file were archived as `sitework-ai.oldform.md` and `sitework-ai.evidence.oldform.md`.

## E1 Fact sheet

| Fact | Finding | Label |
| --- | --- | --- |
| Name, licence | SiteWatch AI (`sitework-ai`), MIT for repo code; Ultralytics code and YOLO11 weights AGPL-3.0; Pexels licence for clips | Confirmed (LICENSE, data/manifests) |
| Kind, status | Portfolio / reference-architecture prototype; README says "complete (M0-M7)" | Per the docs |
| Languages and size | Python ~4,430 lines in agent, api, pipelines; tests ~3,210; scripts ~735; evaluation ~1,630; TypeScript/React ~2,560; Terraform ~895; design docs ~25,800 words | Ran it (wc) |
| Tests | 191 collected: 164 passed, 27 skipped (need Postgres at localhost); 6 more in the UI (`ui/src/showcase/model.test.ts`), not run | Ran it |
| Commits | 55; first 2026-09-15, last code commit 2026-09-27, one docs commit 2026-10-19 (adds an explainer file to the repo) | Confirmed |
| Deployed | Static GitHub Pages demo (workflow `pages.yaml`, last Pages run succeeded 2026-09-27); 0 stars, 0 forks, public | Confirmed (gh) |
| CI | `ci.yaml` (ruff, mypy, pytest with Postgres 16 service, doc-consistency script, schema-export diff; UI test and build; compose config), `contract-agent.yaml`, `iac-check.yaml` (terraform fmt/validate for aws, gcp, azure), `pages.yaml`. Latest `ci` run on 8b8c48a: success | Confirmed (gh run list) |
| Needs | NVIDIA GPU for full stack; Docker; clips, weights and a vendored Prime Agent package are not in git; replay stack needs Docker only | Per the docs |
| Related projects | None cited in the repo | Confirmed |

## E2 Reading and running log

Read: README, PLAN, docs 01, 02 (part), 08 (part), 10 (part), 12 (M5-M7 and review sections), benchmarks, eval-m5 report, spike-01, spike-02, ADR-003, agent/band3.py, worker.py, prime_adapter.py, persistence.py (part), pipelines/vision/rules.py, pipeline.py, detector.py, schemas/models.py, geometry (homography in full; vanishing_point, level_camera, motion headers; zones), broker/streams.py, api/main.py (routes, review), repository (review), config files, the dock calibration JSON, the four workflows, two manifests, the three prompts, the first part and key passages of the archived Gemini conversation, the TechTrack assignment header (course folder), the demo incident JSON and earlier-run note. Not read: the old explainer in the clone, docs 03-07, 09, 11, 13, deployment guides, Terraform, most UI components, vision record.py, evidence.py, calibrate.py, evaluation scripts, the PDF.

Commands run (read-only against the clone; environment in the scratchpad, Python 3.11.15 via uv, packages outside the clone: pydantic, pyyaml, fastapi, uvicorn, websockets, redis, asyncpg, av, numpy, shapely, pytest, pytest-asyncio, ruff, mypy, httpx, types-PyYAML, fakeredis, motmetrics; torch and ultralytics not installed):

1. `pytest -p no:cacheprovider -o addopts="" -q`: 164 passed, 27 skipped, 1 warning (Starlette/httpx deprecation). Skips: Postgres not reachable. Ran it.
2. `ruff check --no-cache .`: all checks passed. `ruff format --check`: 16 files would be reformatted (the project does not claim a format check). Ran it.
3. `mypy --no-incremental` (strict, 38 files): success. Ran it.
4. `python scripts/check_docs.py`: all consistency checks green. Ran it.
5. A probe script (E4) importing the gate, rule engine, schemas and homography from the clone, bytecode writing off. Ran it.
6. `gh run list`, `gh api repos/PCSchmidt/sitework-ai` (read-only). `git log`, `git grep` secret patterns on files and `git log -G` on history: no matches.
7. Diagram PNGs rendered with `@mermaid-js/mermaid-cli` using the system Chrome; charts with matplotlib.

The first test run happened without bytecode suppression and wrote 11 `.pyc` files into git-ignored `__pycache__` folders in the clone; they were deleted. No caches remain. Final `git status --short` in the clone: empty. External calls: `gh` and `npx` (mermaid-cli) only. No paid API, no pushes.

## E3 Claims check (L1 = doc matches the committed result file; L2 = re-run; L3 = recomputed)

| ID | Claim | Where | Check | Verdict |
| --- | --- | --- | --- | --- |
| CL-01 | 191 Python tests (164 offline, 27 Postgres) + 6 UI | README | L2 for 164 + 27 skipped; 6 UI unrun | Supported (UI not run) |
| CL-02 | ruff, mypy, build clean, green in CI | README | L2 for ruff, mypy; CI per gh | Supported |
| CL-03 | YOLO11s 35.0 FPS single-stream at 1080p | README, benchmarks | L1 | Supported |
| CL-04 | 3 streams reach 30.2 FPS each on rested GPU | README | L1: 30.2 is the slowest stream (others 36.9, 32.1) | Partly (wording) |
| CL-05 | TensorRT FP16 +34-57% single-stream | README | L1 | Supported |
| CL-06 | 26/30 first pass (86.7%), all misses timeouts, 100% after retest | README, eval-m5 | L1; raw run not re-run (needs the agent) | Supported at L1 |
| CL-07 | 82.1% classification agreement (96.4% adjusted) | eval-m5 | L1; baseline recomputed from fixtures: 12 of 28 "violation" = 42.9% (L3) | Supported |
| CL-08 | ~43-56K tokens, ~$0.002 per incident | README | L1 against spike-01; the two stored demo incidents show 8.5K-9.0K input and 2.1K-2.9K output tokens | Partly |
| CL-09 | MOTA 0.16-0.46 on MOT17 | README | L1 (0.158, 0.259, 0.459) | Supported |
| CL-10 | Gate tolerance 0.15 m, 0.2 m/s or 5% | README | L2: 0.14 passes, 0.16 fails at 1.2 m; 10.4 passes, 10.6 fails at 10.0 | Supported |
| CL-11 | "The AI has no way to talk its way past the gate" | README | Gate does not judge proximity labels or speed alerts (E4 P1, P7) | Partly |
| CL-12 | "A confirmed incident carries ... a written narrative" | README | Real-agent demo incidents have empty narrative; worker never sets it | Contradicted |
| CL-13 | "multi-agent operations platform" for "chemical handling facilities" | GitHub description | One agent role; no PPE; nothing chemical-specific found | Contradicted |
| CL-14 | Fast plane built from "... a Kalman filter ..." | README | Project's own `kalman.py` unused by pipeline (grep); `cov_trace` hard-coded 0; Ultralytics' tracker has its own | Partly |
| CL-15 | Two of three demo cameras calibrated; rules fire | README | Config, calibration files, demo incident records | Supported at L1 |
| CL-16 | Dock calibration rms 1.21 px, height 1.40 m | README | JSON read; 0.98*307/225 = 1.337 recomputed (L3) | Supported |
| CL-17 | Terraform for 3 clouds validated in CI, never applied | README | Workflow read; CI success per gh; Terraform not read | Supported at L1 |
| CL-18 | Fresh-clone replay path tested 2026-09-26 | README | Not re-run | Not checked |
| CL-19 | No auth; ports on 127.0.0.1 | README | Compose not read; docs/08 states it | Per the docs |
| CL-20 | Agent triage p50 68.8 s | docs/02, eval-m5 | L1 | Supported |

Count: 20 claims: 12 supported (several at L1 only), 4 partly (CL-04, 08, 11, 14), 2 contradicted (CL-12, 13), 2 per the docs or not checked (CL-18, 19).

## E4 Rule attacks (probe results, Ran it)

| ID | Input | Result |
| --- | --- | --- |
| P1 | Proximity alert, true closest approach 1.2 m (frames 5.0, 3.0, 1.2, 1.6 m); verdict distance 1.2 with class violation / false_positive / normal_ops | Gate passes all three |
| P1d | Verdict omits distance | Gate passes |
| P2 | Agent distance 1.34 / 1.36 vs true 1.2 | Pass / reject |
| P2b | True 10.0 m; agent 10.4 / 10.6 | Pass / reject (5% = 0.5 m) |
| P3 | Empty tracks file | Reject, reason given |
| P3b | Damaged JSON line in tracks file | `ValidationError` propagates out of the gate |
| P4 | Only one of the two tracks in the file | Reject |
| P5 | Verdict JSON with NaN, negative, extra key, unknown class | Rejected; Infinity accepted by the schema (then a gate mismatch) |
| P6 | Person 2 m from vehicle for 4 s | Both proximity rules fire |
| P6b | Same, calibration invalid | No events |
| P6c | Two persons 1 m apart | No events |
| P6d | Person at 5 m/s, vehicle at 2.3 m/s | Only the vehicle fires the speed rule |
| P6e | Frames in reverse time order | No events |
| P6f | 12 s continuous | 2 events; cool-down holds |
| P7 | Speed alert, verdict false_positive | Gate passes (schema only) |
| P8 | Four collinear image points | Accepted, rms 1.146 px (inside the 2.0 gate) |
| P9 | 100 px square to 2 m square: (50,50) maps to (1,1), rms 0; with exactly four points the fit is exact, so one corner 3 px off still gives rms about 0 (reviewer re-implementation); with a fifth centre point it is about 0.38. The earlier 2.12 figure could not be reproduced and is not used | Corrected in review |

My reading for P3b: an exception inside `process_one` leaves the entry unacknowledged; `claim_stale` (idle 300 s) redelivers it; with a permanently bad file this repeats. Not run end to end.

## E5 Code map

`pipelines/vision/pipeline.py` (frame loop, `build_tracks`), `detector.py` (YOLO wrapper, class map), `rules.py` (RuleEngine), `evidence.py` (pre/post trigger window), `record.py` (offline recorder for the demo), `kalman.py` (unused at runtime). `pipelines/geometry/`: homography (DLT via SVD), vanishing_point, level_camera, motion (ORB + RANSAC), calibrate (CLI), zones (Shapely). `pipelines/broker/streams.py` (Redis Streams; retention 5 min tracklets, 1 h triggers; consumer groups). `pipelines/schemas/models.py` (Pydantic v2, `extra="forbid"`; DISTANCE_TOL_M 0.15, VELOCITY_TOL_MPS 0.2, TIME_TOL_S 0.2, RELATIVE_TOL 0.05, RMS_GATE_PX 2.0). `agent/worker.py` (consumer, prompt build, gate call), `prime_adapter.py` (JSON-lines RPC, reader thread, 210 s deadline, kill), `band3.py`, `persistence.py`, `transcript.py`, `prompts/` (`root_policy.md` not injected). `api/` (main, repository, reports, schema.sql). `ui/src/` (dashboard; `showcase/` replay). `config/` (rules, zones, cameras, calibration). `evaluation/` (agent_eval, benchmark_models, eval_tracking, 30 fixtures). `scripts/` (replay_demo, showcase_agent, smoke_test, check_docs).

## E6 Model call sites

| Where | Model | Purpose | Settings |
| --- | --- | --- | --- |
| `pipelines/vision/pipeline.py` `run_stream`, Ultralytics `model.track` | YOLO11s (`yolo11s.pt`, COCO) | Detection plus ByteTrack tracking | imgsz 640, confidence gate 0.4, device cuda:0 |
| `pipelines/vision/detector.py` `Detector.detect` | same | detection only (benchmarks) | same |
| `agent/prime_adapter.py` `PrimeAdapter.prompt` | Prime Agent 0.9.3 with the model set in its own settings (docs: GLM-Flash class via OpenRouter; exact model unrecorded) | verification and classification | max turns 8, max tokens 40,000 (advisory), 210 s external timeout |

Cost per the docs: about $0.002 per incident (spike-01: $0.00182-0.00188 on timed runs).

## E7 Tests and CI

191 tests in 26 files (rules 19, api 17, vanishing_point 14, calibrate 13, band3 12, repository 9, broker_streams 9, worker 8, others fewer). Agent tests use a fake agent process and a recorded golden session; no real agent or model is called. Spot checks: `test_zone_dwell_recompute_counts_the_run_ending_at_the_trigger` asserts 2.0 s; `test_warning_tier_does_not_suppress_tighter_rule_of_same_kind` asserts fired == [(2.0, "wide"), (5.0, "tight")]; `test_prompt_timeout_kills_process_and_raises` asserts a timeout in under 5 s and a cleared process. Coverage not measured. CI versus docs: CI runs what the README says; the smoke test is not in CI (docs/09).

## E8 Plan versus results and history

First commit 2026-09-15 20:40 holds PLAN.md with success criteria S1-S6 before any results; final statuses were added 2026-09-26. Not a locked protocol. Credits: 37 commits Claude Sonnet 5, 5 Claude Opus 5.5, 1 Claude Opus 5.5 (1M context): 43 of 55. The 12 uncredited commits are all 2026-09-15 and 09-16. Largest commits: f7f2a01 (68 files, 7,851 insertions, scaffold), 55ecffa, 137f0f6. README: "built with the help of Claude Code". Gemini conversation archived in `project_concepts_ideas.md`.

## E9 Gates and approvals

The only approval-like step is the human review form: `POST /api/v1/incidents/{id}/review` writes a row (reviewer text, decision text, note) and does not change incident state. Reviewer identity is free text. Confirmed.

## E10 Environment

`pyproject.toml` pins `torch==2.11.0+cu128` and `torchvision==0.26.0+cu128` from a CUDA index; `uv.lock` present; `.python-version` 3.11. A fresh install without torch and ultralytics passed the tests here (both are imported lazily in the detector). Benchmarks record GPU thermal state per row. Detector weights are hashed in the manifest. TensorRT engines are machine-specific and not committed.

## E11 Security and privacy scan

Pattern scan of current files and history for keys, tokens and private keys: none. `.env` is git-ignored and none is tracked. Dev Postgres password is a hard-coded default in compose and CI (disclosed). No authentication on the API. Ports bound to localhost by default with a `BIND_ADDR` override (docs/08). Evidence endpoint validates `event_id` with a regex (docs/12). No prompt-injection tests (docs). Agent container runs non-root with no dropped capabilities (docs/08). Python and UI dependencies are locked; images use patch tags, not digests. Prime Agent is private on npm; vendored tarball.

## E12 Shortcomings register

**S1 (High) Gate does not judge the label for proximity alerts.** Evidence: P1. Impact: a wrong label with correct numbers is confirmed. Partly disclosed. Option A: add numeric consistency checks matching the prompt thresholds (under 1.0 m violation, under 2.0 near-miss); gains a stronger gate, costs rejection of some legitimate judgment calls. Option B: leave and document; no cost, weakness stays. Recommend A for proximity. Effort small, payoff high. Verify: a new test rejects false_positive at 1.2 m.

**S2 (High) Speed alerts are not gated.** Evidence: P7, band3 docstring. Disclosed. Option A: recompute maximum speed from stored ground points. Option B: document only. Recommend A. Effort small, payoff medium.

**S3 (Medium) Damaged tracking file can loop.** P3b. Not disclosed. Option A: catch parse errors in the gate and return needs_review. Option B: dead-letter after N redeliveries. Recommend A. Effort small.

**S4 (Medium) Degenerate calibration accepted.** P8; the docstring promises non-collinear points. Option: rank check in `solve`. Effort small.

**S5 (Medium) No real close call; accuracy on real incidents unknown.** Disclosed. Option A: obtain a real near-miss clip with permission. Option B: use public incident data. Effort medium, payoff high.

**S6 (Medium) Licence limit (AGPL-3.0 detector).** Disclosed. Option: a permissively licensed detector, retested. Effort medium.

**S7 (Medium) Documents overstate.** CL-11 to CL-14. The GitHub description fix is trivial.

**S8 (Medium) Prime Agent not rebuildable by outsiders.** Disclosed. Option: private registry or published fork. Effort medium.

Minor: `cov_trace` always 0 although docs/03 says covariance is forwarded; `kalman.py` unused; `root_policy.md` not injected (disclosed); no alarm consumer (disclosed); camera-health endpoint says the watchdog is not wired; 16 files fail a format check; CI does not run the agent; reviewer name unauthenticated; Infinity accepted by the schema.

## E13 Math and method detail

DLT homography: per point two rows `[-x,-y,-1,0,0,0,ux,uy,u]` and `[0,0,0,-x,-y,-1,vx,vy,v]`, SVD, last right singular vector, normalized by h22. RMS reprojection error: map world points back through the inverse and take sqrt(mean(error squared)); valid if at most 2.0 px. Vanishing point: SVD of stacked line equations. Level-camera method: depth vanishing point fitted from traced lines; rms is the perpendicular line-to-point distance; height and focal length assumed (3500 px, 1.4 m). Height check: h = 0.98*307/225 = 1.337 m; person estimate 1.46-1.50; mean 1.40. Speed: displacement over about 1.0 s, reported after 0.5 s of history. Gate tolerance: |claimed - recomputed| <= max(abs_tol, 0.05*|claimed|). Zone dwell: continuous time ending at the last frame at or before the trigger; supported if dwell >= limit - 0.2. Baseline: of 28 labelled fixtures, violation 12, near_miss 8, false_positive 5, normal_ops 3. ByteTrack description in the guide is general knowledge of the published method, not checked in the repository.

## E14 Discrepancies

README says confirmed incidents carry a narrative; real incidents have none (CL-12). README lists a Kalman filter; the project's own is unused (CL-14). docs/03 says Kalman covariance is forwarded; `cov_trace` is always 0. GitHub description versus built scope (CL-13). README "each stream 30.2 FPS" versus slowest stream (CL-04). Token counts differ between the spike table and stored stats (CL-08). The plan lists three sub-agents; one was built (disclosed).

## E15 Production readiness detail

| Trait | Rating | Evidence |
| --- | --- | --- |
| Someone else can run it from a clean start | Partly | Replay stack Docker-only (tested 2026-09-26 per README); full stack needs GPU, manual downloads, vendored agent |
| Automatic checks block a bad change | Partly | CI runs tests, lint, types; no evaluation gate; agent not in CI |
| Quality measured against a baseline | Partly | 42.9% guess baseline computed here; project gives none for agreement; built data |
| Safe when things go wrong | Partly | Timeout and kill, needs_review, safe re-run; poison-message loop; no cost cap beyond timeout |
| People can review or stop the AI | Partly | Review form records decisions; nothing blocks on it |
| Prompts, models, settings versioned | Partly | Prompts and config in git; agent version pinned; model name unrecorded |
| Logs good enough to diagnose | Partly | Python logging, agent_runs table including crashes, transcript per incident; no dashboards or alerts |
| Data and secrets safe | Partly | No secrets found; no auth; no prompt-injection tests |

Placement: Works locally, with some deployable features. Gap list: hosting, sign-in, alarm output, agent runtime, monitoring, retention, cost cap, security review, runbook, licence, safety case (missing or design-only).

## E16 Review dispositions

Not yet run (plain-language reader check and accuracy review pending).

## E17 Completeness and backlog

| Promised | Status | Evidence |
| --- | --- | --- |
| Detection and tracking of people and vehicles | Done and tested | pipeline, tests, MOT17 results |
| Forklift class | Stub (proxy) | spike-02, detector map |
| Excavator and PPE classes | Planned only | README Limitations |
| Calibration (3 methods) and motion compensation | Done and tested | tests for each |
| Proximity, zone, speed rules | Done and tested | test_rules |
| ppe_absence, wrong_way rules | Planned only | rules.py ignores them |
| Evidence capture | Done and tested | test_evidence |
| Agent verification (one role) | Done and tested with a stand-in agent | test_worker, eval-m5 |
| Compliance auditor, shift synthesizer, watchdog, routing, harness specs | Planned only | docs/05 |
| Gate: distance, velocity, zone dwell | Done and tested | test_band3 |
| Gate: speed, labels, duration, time to collision | Not built | band3 docstring |
| API, database, dashboard | Done; dashboard tests thin | test_api (skipped here), 6 UI tests |
| Live video overlay | Partly (recorded) | README |
| Alarm output | Planned only | docs/02 |
| Auth, red-team tests, redaction | Planned only | docs/08 |
| Terraform for 3 clouds | Done (validated only) | iac-check |
| Cost goal per ten minutes of clip (S3) | Not measured | PLAN |
| Fallback worker | Stub by design | worker_fallback.py |

Backlog. Finish: alarm consumer; measure S3. Fix: S1-S4, documents, the unused Kalman tracker or its removal, the narrative field. Improve: real accuracy test, dashboard tests. Add: a permissive detector, a real close-call clip, a scheduled agent run in CI, an evaluation gate. Order: gate gaps and documents (days), evaluation gate and scheduled agent run (days), then real footage. Next milestone exit test: S1-S4 each have a failing-then-passing test and the README matches the code. Judgment: polish and freeze.

## Diagram sources (Mermaid, rendered with mermaid-cli)

learned-vs-rules: `flowchart LR`, Video clip, Object finder YOLO11s learned, Follower ByteTrack fixed rules, Pixels to meters fixed formula, Safety rules fixed, "only when a rule fires" to Checking agent language model learned, Gate fixed recomputation, Stored record. parts: vision worker to waiting line and evidence folder, then agent worker, Prime Agent, gate, database, web service, dashboard; dashed alarm output (not built). journey: aisle incident, six steps. gate-catch: first run, fix, later run, cause, fix, next run. floor, fps and agent-eval are matplotlib charts from numbers in docs/benchmarks.md and docs/eval-m5-agent-slow-path.md; the floor picture is a toy drawing.

## Revision log (2026-10-25, v2 revision)

Previous version archived as `sitework-ai.v1draft.md` (8,172 words by `wc -w`). Revised file: about 7,500 words. Driven by the ten fixes in `sitework-ai.readercheck.md`.

| # | Fix | What changed |
| --- | --- | --- |
| 1 | Opening numbers after plain explanation | The gate is explained in the first paragraph before any result; the opening gives only two headline numbers (26 of 30 first try; 23 of 28 labels vs 43 percent guess) |
| 2 | Define terms at first use | Gate/referee, lanes (was "planes"), track, calibration, cool-down, near-miss, GPU, JSON, MLOps, AGPL defined in the sentence where they first matter, in the SHORT (Full Name) pattern |
| 3 | Cut heavy maths | Removed SVD, ORB, RANSAC, Kalman filter, the camera-height arithmetic and the formula block; kept the toy homography example, the speed jitter example and the gate worked examples |
| 4 | Tool-name inventory | The parts chapter now has plain sentences; Redis, Postgres, FastAPI, React, MediaMTX/RTSP names moved to the code list |
| 5 | Origin material | JHU course number, TechTrack name and the Gemini dialogue detail cut to a short paragraph |
| 6 | "So what" per figure | Forklift workaround (alerts mean "big truck-shaped thing"), tracking scores (a floor for crowds), TensorRT (a measurement, not default), speed (met only for bursts) |
| 7 | Defects stated once | The four holes found by probing, the unused tracker and the always-zero uncertainty value now appear only in the shortcomings chapter; the testing chapter points there |
| 8 | Agent-eval chart | Regenerated: axis 0 to 100, no clipped label, bar order top to bottom. The 96.4 percent bar is labelled "after the four timeout cases were re-run (adjusted)" and the text now states 27 of 28 = 96.4 percent and that it is an after-the-fact adjustment |
| 9 | Headline softened | "An AI never has the last word on a fact" removed. The text now says the gate recomputes key numbers, checks numbers only for proximity, time and verdict for zones, and format only for speed alerts |
| 10 | Length and self-praise | Cut by about 670 words; removed "unusually honest", "honestly reported", "strong candidate", "which is right"; "In short" lines kept but varied; "a check run for this guide" wording removed; recruiter table slimmed to three columns |

Also: removed the confirm-style sentences, outline codes and local paths (none were present in headings). Numbers were carried over unchanged from v1; no new facts were added. The chart values (42.9, 82.1, 96.4 percent; 12, 23, 27 of 28) match CL-07 above.

Not re-verified in this pass: all other claims remain as labelled in E1 to E17.
