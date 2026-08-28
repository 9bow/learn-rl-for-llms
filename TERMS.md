# 용어 추가 제안

이 파일은 [AI/ML 용어집(terms.kr)](https://poc.terms.kr/llms.txt)을 2026-08-28에 확인했을 때 수록되어 있지 않았고, 이 학습 사이트에서 반복적으로 사용하는 용어만 모은 보조 용어집입니다. 이미 수록된 `reinforcement learning`, `policy gradient`, `direct preference optimization`, `rollout`, `rejection sampling`은 중복해 적지 않습니다.

| 영어 | 권장 한국어 | 간단한 정의 | 공식·원문 근거 |
| --- | --- | --- | --- |
| Reinforcement Learning from Human Feedback (RLHF) | 인간 피드백 기반 강화학습 | 사람이 비교·평가한 선호를 보상 신호 또는 정책 학습에 사용하는 후학습 방법. | [InstructGPT](https://arxiv.org/abs/2203.02155) |
| Reinforcement Learning from AI Feedback (RLAIF) | AI 피드백 기반 강화학습 | AI가 생성·평가한 피드백을 사용해 정책을 개선하는 방법. 인간 피드백을 완전히 대체한다는 뜻은 아니다. | [Constitutional AI](https://arxiv.org/abs/2212.08073) |
| Reinforcement Learning with Verifiable Rewards (RLVR) | 검증 가능한 보상 기반 강화학습 | 수학 정답, 프로그램 실행, 형식 검증처럼 자동 판정 가능한 결과를 보상으로 쓰는 강화학습. | [DeepSeek-R1](https://arxiv.org/abs/2501.12948) |
| Proximal Policy Optimization (PPO) | 근접 정책 최적화 | 이전 정책에서 지나치게 멀어지는 업데이트를 제한하는 정책 경사 알고리즘. | [PPO](https://arxiv.org/abs/1707.06347) |
| Group Relative Policy Optimization (GRPO) | 그룹 상대 정책 최적화 | 같은 프롬프트의 여러 응답을 한 그룹으로 두고 상대 보상으로 advantage를 추정하는 방법. | [DeepSeekMath](https://arxiv.org/abs/2402.03300) |
| Group Sequence Policy Optimization (GSPO) | 그룹 시퀀스 정책 최적화 | 토큰별이 아니라 시퀀스 가능도에 기반해 비율·클리핑·보상을 정의하는 그룹 정책 최적화 방법. | [GSPO](https://arxiv.org/abs/2507.18071) |
| Process Reward Model (PRM) | 과정 보상 모델 | 최종 답뿐 아니라 중간 추론 단계에도 점수를 부여하는 보상 모델. | [Let’s Verify Step by Step](https://arxiv.org/abs/2305.20050) |
| Outcome Reward Model (ORM) | 결과 보상 모델 | 완성된 응답이나 최종 답에 점수를 부여하는 보상 모델. | [Let’s Verify Step by Step](https://arxiv.org/abs/2305.20050) |
| Process Supervision | 과정 감독 | 최종 결과가 아니라 중간 추론 또는 행동 단계를 감독·평가하는 방식. | [Let’s Verify Step by Step](https://arxiv.org/abs/2305.20050) |
| Outcome Supervision | 결과 감독 | 최종 결과의 정오·선호만으로 감독 신호를 만드는 방식. | [Let’s Verify Step by Step](https://arxiv.org/abs/2305.20050) |
| Verifier | 검증기 | 출력이나 실행 결과가 규칙·테스트·형식 명세를 만족하는지 판정하는 프로그램 또는 절차. | [TreeRL](https://arxiv.org/abs/2506.11902) |
| Reference Model | 참조 모델 | 정책 변화의 기준 또는 KL 제약 계산에 쓰는 고정 모델. | [DPO](https://arxiv.org/abs/2305.18290) |
| Test-Time Scaling | 추론 시점 스케일링 | 학습 뒤 추론 때 더 긴 탐색·여러 샘플·검증을 사용해 성능을 높이는 전략. | [OpenAI o1 System Card](https://openai.com/index/openai-o1-system-card/) |
| Credit Assignment | 신용 할당 | 지연된 결과를 앞선 여러 행동 또는 추론 단계에 얼마나 배분할지 정하는 문제. | [Sutton & Barto](http://incompleteideas.net/book/the-book-2nd.html) |
| Long Horizon | 장기 지평 | 보상이 나오기까지 많은 단계가 필요한 의사결정 구간. | [RAGEN](https://arxiv.org/abs/2504.20073) |
| Trajectory | 궤적 | 환경에서 관찰·행동·보상이 시간 순서로 이어진 기록. | [RAGEN](https://arxiv.org/abs/2504.20073) |
| Agentic Reinforcement Learning | 에이전트형 강화학습 | 도구·환경과 여러 단계로 상호작용하는 에이전트를 강화학습으로 개선하는 접근. | [RAGEN](https://arxiv.org/abs/2504.20073) |
| Asynchronous Reinforcement Learning | 비동기 강화학습 | 롤아웃 생성과 정책 학습을 동시에 진행해 장치 유휴 시간을 줄이는 학습 방식. | [OpenRLHF](https://github.com/OpenRLHF/OpenRLHF) |
| Policy Staleness | 정책 최신성 저하 | 롤아웃을 만든 정책과 현재 업데이트 중인 정책의 차이로 생기는 오프폴리시 편향. | [IMPALA](https://arxiv.org/abs/1802.01561) |
| Mixture of Experts (MoE) | 전문가 혼합 | 입력에 따라 일부 전문가 네트워크만 선택해 계산하는 희소 모델 구조. | [Qwen3 기술 보고서](https://arxiv.org/abs/2505.09388) |
| Computer Use | 컴퓨터 사용 | 화면 관찰과 키보드·마우스 행동을 통해 실제 컴퓨터 환경을 조작하는 에이전트 능력. | [OSWorld](https://arxiv.org/abs/2404.07972) |
