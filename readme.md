# 디자인 패턴

### 디자인 패턴이란

- 패턴은 겪은 문제점들에 대한 대응방안을 어느정도 정형화 시킨 것.
- 패턴은 문제를 해결하는 과정을 일반화한 것.
- ###### 그렇기에 적절한 패턴을 활용하기 위해서는, 어떤 문제를 어떤 의도로써 풀어갈 것인지 잘 파악해야 한다.

### 소프트웨어 공학에서 디자인 패턴은,

- 주로 객체지향을 기반으로, 디자인 패턴이 그려지는 듯 하다.
- GOF는 객체지향의 시각에서 24개의 패턴으로 정리함.
- ###### 용이한 변경 가능성과 가독성(의도파악)을 통해, 제품의 유지보수성 개선시킨다.

#### 생성패턴 ~ 객체의 생성
###### 객체간 느슨한 결합으로 설계하는 것을 지향 ~ 유연한 확장과 편리한 유지보수
- 팩토리 패턴
- 싱글턴 패턴
- 팩토리 메서드 패턴
- 추상 팩토리 패턴
- 빌더 패턴
- 프로토타입 패턴

#### 구조패턴 ~ 객체의 확장
###### 단일 책임을 갖는 객체를 어떻게 유연하게 합칠 것인가 ~ 상속보단 합성(결합)
 - 어댑터 패턴
 - 브릿지 패턴
 - 복합체 패턴
 - 장식자 패턴
 - 파사드 패턴
 - 플라이웨이트 패턴
 - 프록시 패턴

#### 행동패턴 ~ 객체의 책임과 상호작용
###### 단일 책임을 갖는 객체끼리 어떻게 상호작용(연결)시킬 것인가
###### 단일책임에 따라 행동을 분리 (feat 추상화와 상속 & 의존성과 복합객체) & 상호작용 규정
 - 반복자 패턴
 - 명령 패턴
 - 방문자 패턴
 - 체인 패턴
 - 감시자 패턴
 - 중재자 패턴
 - 상태 패턴
 - 탬플릿 메서드 패턴
 - 전략 패턴

 