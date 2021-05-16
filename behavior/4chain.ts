{
  // DP=behavior/4chain npm start

  /**
   *  체인 패턴
   * 객체 메시지의 송신과 수신을 분리해 처리하는 패턴
   *  객체지향에서 메시지 전송: 다른 객체에 접근해 인자를 주어 메서드를 호출하는 동작
   *  상태값은 동작을 분리하는 조건이 됨 (메서드 인자로 주어짐)
   *
   *
   * 이벤트 드리븐: 이벤트 메시지에 따라 다른 객체의 메서드를 수행
   *  핸들러: 상태값에 따른 다른 수행처리를 매개해주는 메서드
   *
   * 체인 패턴:
   *  핸들러 객체가 담당하던 조건 처리 로직을 실제 동작 객체로 이동
   *   실제 동작 객체: 상태확인기능 | 동작기능 으로 구현 (각각이 독립적인 사슬 고리)
   *   이벤트 동작의 검출을 위해, 단순히 동작객체를 순회함 -> 상태 체크 후 맞으면 수행 아니면 다른 객체로..
   *
   * 단점:
   *  조건에 부합할 때까지 순차적으로 이벤트 객체 순회.. 비효율적, 시간지연..
   *  어떤 객체가 부합해서, 기능을 수행하는지 파악하기 힘듦..
   *
   * 장점:
   *  이벤트를 특정하기 힘든 상황에서 활용하기 좋음! 신경쓸 필요가 없음, 단순 체인 등록만!
   *  이벤트 확장이 용이 ~ 단순히 새로운 사슬 추가! (실행 유무는 사슬 구성 객체에서 책임)
   *
   * 사용사례) 미들웨어: 객체의 특정 행위 수행전에 미리 실행되어야 하는 기능들
   *  체이닝 패턴으로 연결시켜 전처리 기능 파이프라이닝!
   */

  // 동작 객체
  interface IAction {
    execute(): any;
  }
  class actionA implements IAction {
    execute() {
      console.log("객체 A의 동작을 수행합니다!");
    }
  }
  class actionB implements IAction {
    execute() {
      console.log("객체 B의 동작을 수행합니다!");
    }
  }
  class actionC implements IAction {
    execute() {
      console.log("객체 C의 동작을 수행합니다!");
    }
  }
  // 이벤트 핸들러
  class Handler {
    constructor() {
      console.log("이벤트 핸들러를 생성합니다!");
    }
    // 입력된 상태값에 따라 다른 동작을 수행한다!
    event(msg: string) {
      let action;
      // 핸들러에서 상태값 분기 로직이 존재한다!
      if (msg === "1") {
        action = new actionA();
      } else if (msg === "2") {
        action = new actionB();
      } else if (msg === "3") {
        action = new actionC();
      }
      if (!action || !action.execute) {
        return "맵핑된 콜백객체가 없습니다!";
      }
      return action.execute();
    }
  }

  // 실행
  console.log("=====이벤트 핸들러 작업 처리=====");
  const eventHandler = new Handler();
  eventHandler.event("1");
  eventHandler.event("2");
  eventHandler.event("3");

  // 체인패턴
  abstract class Chain {
    // 객체 정보의 연결 (다음 객체)을 위한 내부 객체
    protected next: Chain;
    setNext(actionObj: Chain) {
      this.next = actionObj;
    }
    // 각 사슬의 구성원이 되는 객체가 수행되는 함수
    abstract execute(msg: string): any;
  }

  // 구체화된 체인 구성 객체
  class chainedActionA extends Chain {
    execute(msg: string) {
      console.log("A 검사중..");
      // 행위 수행시, 상태값 체크
      if (msg === "A") {
        console.log("객체 A의 동작을 수행합니다!");
        return;
      }
      // 내 이벤트가 아니면, 체이닝된 다른 수행객체에 위임
      // 조건 만족할 때까지 재귀적으로 수행된다!
      if (!this.next) {
        return console.log("맵핑된 행위를 찾을 수 없습니다..");
      }
      return this.next.execute(msg);
    }
  }
  class chainedActionB extends Chain {
    execute(msg: string) {
      console.log("B 검사중..");
      if (msg === "B") {
        console.log("객체 B의 동작을 수행합니다!");
        return;
      }
      if (!this.next) {
        return console.log("맵핑된 행위를 찾을 수 없습니다..");
      }
      return this.next.execute(msg);
    }
  }
  class chainedActionC extends Chain {
    execute(msg: string) {
      console.log("C 검사중..");
      if (msg === "C") {
        console.log("객체 C의 동작을 수행합니다!");
        return;
      }
      if (!this.next) {
        return console.log("맵핑된 행위를 찾을 수 없습니다..");
      }
      return this.next.execute(msg);
    }
  }
  class ChainHandler {
    private startEventObj: Chain;
    constructor(actions: Chain[]) {
      console.log("체인 패턴 핸들러를 생성합니다!");
      // 순차적으로 다음 행위 객체 등록 (체이닝)
      actions.forEach((action, index) => {
        if (actions[index + 1]) {
          action.setNext(actions[index + 1]);
        }
      });
      this.startEventObj = actions[0];
      console.log(`체이닝 완료! : ${actions.length}`);
    }
    // 입력된 상태값에 따라 다른 동작을 수행한다!
    event(msg: string) {
      this.startEventObj.execute(msg);
    }
  }

  const chainingEvents = new ChainHandler([
    new chainedActionA(),
    new chainedActionB(),
    new chainedActionC(),
  ]);
  console.log("\n=====체이닝 이벤트 핸들러 작업 처리=====");
  chainingEvents.event("B");
  chainingEvents.event("A");
  chainingEvents.event("C");
  chainingEvents.event("D");
}
