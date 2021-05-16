{
  // DP=behavior/6mediator npm start

  /**
   *  중재자 패턴
   * 분산된 객체들의 복잡한 관계를 객체를 활용해 정리해주는 패턴
   *  직접적으로 객체간 접근 X, 중재자에게 필요한 행동을 요청함
   *   ~ 객체의 연관관계를 하나의 중간 매개 객체에 집중해, 관계의 결합도를 줄임
   *   ~ 중재자 매개 통신으로, 복잡한 통신과 제어를 한 곳에 집중하는 효과
   *
   * 중재자 객체: 관리할 객체들의 목록 관리 (추가, 제거..)
   *  관리 객체: 중재자를 통해, 타른 동료객체에 연결
   *  ~ 관리객체 -> 중재자객체(타객체에 통신 요청) / 중재자객체 -> 관리객체(받은 요청 전파) 로 양방향 통신으로 구성
   *
   * ex) 메신저 룸 설계) 각 독립 객체가 소통하는 중개자 객체(채팅방)을 생성하고 ~ 구성 유저가 일종의 객체 시그니처가 된다!
   *  메시지를 쏘면, 중개객체가 포함하는 모든 유저에게 (나 자신도) 메시지가 송신됨
   *
   * -> 객체간 복잡한 M:N 관게를 풀어감. 관계가 생성될 때마다 중개자 객체를 생성하고, 필요없어지면 지우는 식으로
   *   관계를 단순한 소결합으로 관리한다.
   */

  // 중재자 객체
  abstract class Mediator {
    // 중재할 관리 객체들 집합체
    protected colleagues: Colleague[];

    addColleague(cObj: Colleague) {
      this.colleagues.push(cObj);
    }

    abstract mediate(data: string, cObjName: string): void;
  }
  class ConcreteMediator extends Mediator {
    constructor() {
      super();
      this.colleagues = [];
      console.log("중개자 객체 생성!");
    }

    mediate(data: string, cObjName: string) {
      console.log(`중개자 메시지 수신 from ${cObjName}`);
      // 관리하는 객체 모두에게 메시지 송신
      this.colleagues.forEach((colleague) => {
        colleague.getMessage(data);
      });
    }
  }

  // 중재자를 통해 서로 통신하는 관리 객체
  abstract class Colleague {
    // 통신을 도와주는 객체
    protected mediator: Mediator;

    setMediator(mediator: Mediator) {
      this.mediator = mediator;
    }

    // 중재자 메시지 송수신용 메서드
    abstract sendMessage(data: string): void;
    abstract getMessage(data: string): void;
  }
  class ConcreteColleague extends Colleague {
    protected name: string;
    constructor(name: string) {
      super();
      this.name = name;
      console.log(`관리객체 ${name} 생성!`);
    }

    userName() {
      return this.name;
    }

    // 중재자를 통해 다른 객체와 통신하는 메서드 (능동적)
    sendMessage(data: string) {
      console.log(`${this.name} 데이터 송신중..`);
      this.mediator.mediate(data, this.name);
    }

    // 중재자를 통해 다른 객체의 통신을 받는 메서드 (수동적)
    getMessage(data: string) {
      console.log(`${this.name}, 데이터 수신 : ${data}`);
    }
  }

  // 실행
  // 중재자 객체 생성
  const kakaoTalkRoom = new ConcreteMediator();
  // 중재자 객체가 연결을 관리하는 객체들 생성 및 DI
  const user1 = new ConcreteColleague("SMJ");
  // 이렇게 양방향 DI를 걸어줘야 한다!
  kakaoTalkRoom.addColleague(user1);
  user1.setMediator(kakaoTalkRoom);
  const user2 = new ConcreteColleague("JHK");
  kakaoTalkRoom.addColleague(user2);
  user2.setMediator(kakaoTalkRoom);
  const user3 = new ConcreteColleague("IHP");
  kakaoTalkRoom.addColleague(user3);
  user3.setMediator(kakaoTalkRoom);
  const user4 = new ConcreteColleague("DSK");
  kakaoTalkRoom.addColleague(user4);
  user4.setMediator(kakaoTalkRoom);

  user1.sendMessage("오늘 고고??");
  user2.sendMessage("ㄱㅊㄱㅊ");
  user3.sendMessage("ㄴㄴ 셤공부");
  user4.sendMessage("나도 플젝 ㅠㅠ");
}
