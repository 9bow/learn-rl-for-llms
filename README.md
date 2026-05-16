# LLM을 위한 강화학습

LLM 분야에서 쓰이는 강화학습 기법을 기초부터 RLHF, DPO, GRPO, RLVR, 코드 RL, Vision RL, 에이전트 RL, 인프라와 안전성까지 연결해 설명하는 한국어 학습 사이트입니다.

## 대상

- 강화학습 기본 개념을 LLM 맥락에서 다시 정리하려는 연구자와 엔지니어
- RLHF, DPO, GRPO, RLVR, PRM 같은 정렬·추론 학습 기법의 차이를 알고 싶은 학습자
- LLM 학습 파이프라인, 평가, 분산 RL 인프라를 함께 이해하려는 팀

## 구성

- 11개 섹션
- 61개 MDX 챕터
- 11개 섹션별 퀴즈
- 문서 품질 점검 스크립트 포함
- Astro 6 + Starlight + React 기반
- 수식 렌더링을 위한 KaTeX 설정 포함

## 커리큘럼

1. 강화학습 기초: MDP, 정책, 가치 함수, policy gradient, PPO, 보상 설계
2. LLM과 RL의 만남: LLM을 RL 에이전트로 보는 관점, KL penalty, 온라인/오프라인 RL
3. RLHF: 보상 모델, PPO fine-tuning, 한계, Constitutional AI, InstructGPT 사례
4. 직접 선호 최적화: DPO, IPO, KTO, ORPO, SimPO, RainbowPO
5. Reasoning과 RL: GRPO, DAPO, PRM, STaR, Quiet-STaR, 탐색과 test-time scaling
6. RLVR: 검증 가능한 보상, 수학/코드 RLVR, DeepSeek-R1, rule-based reward, scaling
7. 코드 생성과 RL: 코드 RL 기본, StepCoder, process reward, AceMath, 오픈소스 추론 모델
8. Vision 모델과 RL: 멀티모달 RLHF, RLSD, diffusion RL, reward model 설계
9. 에이전트 RL: 웹 에이전트, tool calling, multi-turn, multi-agent RL
10. RL 인프라: TRL, OpenRLHF, veRL, 분산 학습, 실험 관리
11. 안전성과 미래: 안전 정렬, scalable oversight, 보상 해킹, 열린 문제

## 로컬 개발

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## 문서 검증

```bash
pnpm check:docs
pnpm verify:scripts
```

## 주요 경로

- 문서 본문: `src/content/docs/`
- 퀴즈 데이터: `public/data/quiz/`
- 문서 검증 스크립트: `scripts/`
- 공통 학습 컴포넌트: `src/components/learning/`
- 사이트 설정: `astro.config.mjs`
