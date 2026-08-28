# LLM을 위한 강화학습

LLM 분야에서 쓰이는 강화학습 기법을 기초부터 RLHF, DPO, GRPO, RLVR, 코드 RL, Vision RL, 에이전트 RL, 인프라와 안전성까지 연결해 설명하는 한국어 학습 사이트입니다.

## 대상

- 강화학습 기본 개념을 LLM 맥락에서 다시 정리하려는 연구자와 엔지니어
- RLHF, DPO, GRPO, RLVR, PRM 같은 정렬·추론 학습 기법의 차이를 알고 싶은 학습자
- LLM 학습 파이프라인, 평가, 분산 RL 인프라를 함께 이해하려는 팀

## 구성

- 11개 섹션
- 60개 학습 챕터 + 홈 문서 1개
- 11개 섹션별 퀴즈 JSON 데이터
- 문서 품질 점검 스크립트 포함
- Astro 6 + Starlight + React 기반
- 수식 렌더링을 위한 KaTeX 설정 포함

## 커리큘럼

1. 강화학습 기초: MDP, 정책, 가치 함수, 정책 경사, PPO, 보상 설계
2. LLM 후학습과 RL의 역할: SFT·선호 최적화·온라인 RL, 토큰 수준 MDP, KL 제약과 재현성
3. RLHF와 AI 피드백: 보상 모델, PPO 기반 RLHF, Constitutional AI, RLAIF와 한계
4. 직접 선호 최적화: DPO 수학, IPO·KTO·ORPO·SimPO, 강건·순위·온라인 선호 최적화
5. 추론 모델과 정책 최적화: GRPO, DAPO, Dr. GRPO, REINFORCE++, GSPO, PRM·ORM, 탐색
6. RLVR: 검증기 설계, 수학·코드 RLVR, DeepSeek-R1, 규칙 보상, 스케일링과 커리큘럼
7. 소프트웨어 공학과 코드 RL: 실행 환경, 테스트·검증기, 과정 보상, SWE-bench 기반 평가
8. 멀티모달 모델과 RL: VLM RLHF·RLVR, 시각 추론, 컴퓨터 사용, 확산 모델 RL
9. 에이전트 RL: 환경 설계, 웹·도구·멀티턴 상호작용, 비동기 학습과 멀티에이전트
10. RL 학습 인프라와 운영: TRL, OpenRLHF, verl, 분산·비동기 롤아웃, 실험 재현성
11. 안전성·평가·열린 문제: 안전 정렬, 명세 게임, scalable oversight, 레드팀과 평가

## 로컬 개발

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## 검증

변경 후에는 다음 명령으로 Starlight 콘텐츠, MDX, React 컴포넌트, KaTeX 수식 렌더링, 정적 자산 경로를 확인합니다.

```bash
pnpm build
```

문서 품질 점검 스크립트는 `scripts/manifests/tier-a-paths.txt`에 등록된 Tier A 문서의 참고문헌, 표기, 직관 설명과 SVG 예산을 추가로 확인합니다.

```bash
pnpm check:docs
pnpm verify:scripts
```

## 콘텐츠 품질 기준

- RLHF, DPO, GRPO, RLVR 등 방법론은 목적 함수, 보상 신호, 데이터 요구사항을 구분해 설명합니다.
- 최신 연구 동향은 과장된 성능 주장보다 재현 조건, 평가 한계, 안전성 쟁점을 함께 다룹니다.
- 수식은 직관 설명과 연결하고, 표기법은 `00-notation.mdx`와 일관되게 유지합니다.

## 주요 경로

- 문서 본문: `src/content/docs/`
- 퀴즈 데이터: `public/data/quiz/`
- 문서 검증 스크립트: `scripts/`
- 공통 학습 컴포넌트: `src/components/learning/`
- 사이트 설정: `astro.config.mjs`
