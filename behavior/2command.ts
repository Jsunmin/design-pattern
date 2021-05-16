{
  // DP=behavior/2command npm start

  /**
   * 명령 패턴
   *  수행하는 기능(동작)을 메서드가 아닌 객체로 제공하는 패턴
   *   동작에 포커싱한 객체 - 동작에 필요한 프로퍼티, 메서드를 캡슐화한다!
   *
   * 행위 객체와 실행 객체를 분리해서,
   *  ~ 동작의 실행 시점 제어: 명령 실행 객체가 명령을 담고 있다가, 특정 시점에 수행시킴
   *  ~ 객체지향적인 이벤트 콜백 처리
   *  ~ 위임 받은 명령객체를 순차적으로 수행X, 설장한 실행시점에 수행 (동작 예약 처리도 가능!)
   *  ~ 명령을 담고 있으면서, 내린 명령에 대한 복구 & 취소 기능도 가능!
   *
   * 구성
   *  동작 객체: 동작을 정의한 객체
   *  명령 객체: 동작을 수행하는 객체
   *   - 자체적인 동작을 담고 있는 객체
   *   - 리시버: 동작을 정의하는 객체를 받는 컨테이너 객체
   *     ~ 수신자(receiver)객체와 동작(action)객체로 구성
   *     ~ 리시버가 명령객체에 행동 위임
   *  인보커: 생성된 명령 객체들을 저장하고 관리하는 객체
   *   ~ 작업을 저장하는 객체 (리시버와 같은 명령객체 저장)
   *   ~ 특정 작업(명령)들을 특정 사간에 수행 or 취소..
   *
   * 단순 행위와 행위를 수행하는 명령을 구분함으로써,
   *  행위 객체의 확장이 용이!
   *  인보커라는 명령 객체 컨테이너를 통해, 명령 수행을 관리! ~ 명령 등록, 수행, 취소..
   */

  // 순수 행동(기능) 객체
  class action1 {
    action1() {
      console.log("기능 1-1 수행!");
    }
    action2() {
      console.log("기능 1-2 수행!");
    }
  }
  interface Command {
    // 통일화된 명령 수행 메서드
    execute(...args: any[]): any;
    undo(...args: any[]): any;
  }

  // 단순 명령 객체
  class Exec1 implements Command {
    // 수행 기능
    execute(id: number, name: string) {
      console.log(`${id}: ${name} 내부 명령 수행! 1111`);
    }

    // 수행한 기능 취소
    undo(id: number) {
      console.log(`${id}: 내부 명령 수행 취소합니다! 1111`);
      console.log("해당 동작(이벤트)에서 수행한 내용 롤백");
    }
  }

  // 행위를 DI받는 명령 객체 (리시버)
  class Exec2 implements Command {
    receiver: any;
    // 행위 객체를 받아 저장
    constructor(actionObj: any) {
      this.receiver = actionObj;
    }
    execute(id: number, time: string) {
      console.log(`${id}: ${time} DI로 받아온 명령 수행! 2222`);
      console.log("전처리!!");
      // DI 객체에 기능 위임 실행!
      this.receiver.action1();
      this.receiver.action2();
    }

    undo(id: number) {
      console.log(`${id}: 내부 명령 수행 취소합니다! 2222`);
      console.log("해당 동작(이벤트)에서 수행한 내용 롤백");
    }
  }

  // 명령객체를 담는 인보커 (명령의 저장 수행 취소 등을 관리!)
  class Invoker {
    // 명령어를 저장하는 컨테이너
    private commands: { [key: string]: Command } = {};
    // 수행한 명령어 기록
    private commandLogs: {
      cmdKey: string;
      commandAt: Date;
      args: any[];
    }[] = [];

    setCommand(key: string, obj: Command) {
      this.commands[key] = obj;
    }

    rmCommand(key: string) {
      delete this.commands[key];
    }

    execute(key: string, ...args: any[]) {
      if (this.commands[key]) {
        this.commands[key].execute(...args);
        this.commandLogs.push({
          cmdKey: key,
          commandAt: new Date(),
          args: args,
        });
      }
    }

    undo() {
      const recentEvent = this.commandLogs.pop();
      if (!recentEvent) {
        console.log("실행 취소할 명령이 없습니다!");
        return;
      }
      console.log(
        `${recentEvent.commandAt}에 수행된 ${recentEvent.cmdKey} 명령을 수행 취소합니다`
      );
      console.log(`받은 인수 ${recentEvent.args}`);
      console.log("취소중...");
      console.log("취소완료!");
    }
  }

  // 실행
  // 명령 객체 생성!
  const exec1 = new Exec1();
  const exec2 = new Exec2(new action1());
  const commandInvoker = new Invoker();
  // 명령 컨테이너 객체에 명령 세팅
  commandInvoker.setCommand("cmd1", exec1);
  commandInvoker.setCommand("cmd2", exec2);

  // 등록한 명령의 시간 지연후 실행!
  console.log("=====작업수행!!=====");
  commandInvoker.execute("cmd1", 10, "222");
  console.log("클라이언트 다른 작업중...");
  commandInvoker.execute("cmd2", 100, "11:20");

  console.log("\n=====작업취소!!=====");
  // 수행한 명령 롤백
  commandInvoker.undo();
  commandInvoker.undo();
  commandInvoker.undo();
}
