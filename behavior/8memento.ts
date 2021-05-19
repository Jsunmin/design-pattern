{
  // DP=behavior/8memento npm start

  /**
   *  메멘토 패턴
   * 객체의 상태 이력을 저장하는 객체를 둠으로써, 특정 객체의 롤백을 가능하도록 하는 패턴
   *  특정 행동 후, 체크포인트를 기록하는 객체에 스냅샷을 저장해서 특정 상태 기록

   * 객체 되돌리기: 취소행위를 하는 메서드 호출 | 실행전의 상태로 객체 변화 (프로퍼티)
   * 
   * 상태 변화를 담당하는 객체는, 보통 스택 형식으로 이력 저장 및 LIFO 롤백
   * 
   * 구성
   *  메멘토 객체: 객체의 정보 저장 및 겟의 책임
   *  오리지네이터 객체: 실체 객체와 메멘토 객체 사이의 매개 책임
   *   - 메멘토 객체로의 접근은 오리지네이터만 가능!
   *   - 오리지네이터 내부에 버킷을 두고, 다음 과정을 거침
   *     해당 실채객체 -> 내부버킷 -> 메멘토객체 ~ 스냅샷 저장
   *     메멘토객체 -> 내부버킷 -> 해당 실체객체 ~ 스냅샷 복원
   *  케어테이커 객체: 다수의 스냅샷(메멘토) 보관 및 관리 - 내부 스택을 통해
   *   메멘토 객체의 생성 복구 또한 오리지네이터를 경유해서 씀! (저장 및 복구에 오리지네이터 인자로 받아야!)
   */

  type Properties = { [key: string]: any };
  // memento class
  class Memento {
    protected obj: Properties;

    // 전달된 객체를 deep copy해서 내부객체로 저장
    constructor(obj: Properties) {
      this.obj = { ...obj };
    }

    getObj() {
      return this.obj;
    }
  }

  // originator class
  class Originator {
    protected states: Properties;

    create() {
      return new Memento(this.states);
    }
    restore(memento: Memento) {
      this.states = { ...memento.getObj() };
    }

    getStates() {
      return this.states;
    }
    setStates(states: Properties) {
      this.states = states;
    }
  }

  // 실행 ~ memento & originator
  // 실체 객체
  class Abc {
    constructor(
      protected a: string,
      protected b: string,
      protected c: string
    ) {}

    getAllStates() {
      return {
        a: this.a,
        b: this.b,
        c: this.c,
      };
    }
    setAState(val: string) {
      this.a = val;
    }
    setBState(val: string) {
      this.b = val;
    }
    setCState(val: string) {
      this.c = val;
    }
    setAllStates(obj: Properties) {
      this.a = obj.a;
      this.b = obj.b;
      this.c = obj.c;
    }
  }
  console.log("\n실행 1");
  const originator = new Originator();
  const aInstance = new Abc("a", "bb", "ccc");
  console.log("1", aInstance.getAllStates());
  originator.setStates(aInstance); // 실체 객체의 상태값을 오리지네이터에 등록
  const memento = originator.create(); // 저장한 값을 기록하는 메멘토 생성
  aInstance.setAState("ddd"); // 실체 객체 값 변경
  console.log("2", aInstance.getAllStates());
  originator.restore(memento); // 저장한 스냅샷 가져와 복구!
  aInstance.setAllStates(originator.getStates()); // 과거 스냅샷으로 실체 객체 원복
  console.log("3", aInstance.getAllStates());

  // caretaker class
  class CareTaker {
    protected stack: Memento[];

    constructor() {
      this.stack = [];
    }

    // 오리지네이터가 메멘토와 상호작용하는 로직을 전부 내부화!
    saveSnapshot(origin: Originator) {
      // 오리지네이터로부터 메멘토객체를 생성받아 저장
      this.stack.push(origin.create());
    }
    rollbackFromSnapshot(origin: Originator) {
      const memento = this.stack.pop();
      if (!memento) {
        return "저장된 스냅샷이 없습니다!";
      }
      origin.restore(memento);

      return origin.getStates();
    }
  }

  // 실행2 ~ memento & originator & caretaker
  console.log("\n실행 2");
  const origin2 = new Originator();
  const care = new CareTaker();

  // 오리지네이터는 메멘토 객체에 대한 출입구 역할만!
  // ~ 저장한 스냅샷(메멘토 객체) 관리는 케어테이커에 위임!
  const aInstance2 = new Abc("ㄱ", "ㄴㄴ", "ㄷㄷㄷ");
  console.log("1", aInstance2.getAllStates());
  origin2.setStates(aInstance2.getAllStates()); // 스냅샷 생성
  care.saveSnapshot(origin2); // 저장한 스냅샷 스택에 저장
  aInstance2.setAState("가?"); // 상태변화 1
  console.log("2", aInstance2.getAllStates());
  origin2.setStates(aInstance2.getAllStates());
  care.saveSnapshot(origin2);
  aInstance2.setCState("다다다!!"); // 상태변화 2
  console.log("3", aInstance2.getAllStates());
  origin2.setStates(aInstance2.getAllStates());
  care.saveSnapshot(origin2);
  console.log("실행2 롤백 시작");
  const rollback3 = care.rollbackFromSnapshot(origin2); // 롤백 내용 가져오고
  if (typeof rollback3 !== "string") {
    aInstance2.setAllStates(rollback3); // 실체 객체에 롤백 내용 저장
  }
  console.log("3", aInstance2.getAllStates()); // 롤백 확인
  const rollback2 = care.rollbackFromSnapshot(origin2);
  if (typeof rollback2 !== "string") {
    aInstance2.setAllStates(rollback2);
  }
  console.log("2", aInstance2.getAllStates());
  const rollback1 = care.rollbackFromSnapshot(origin2);
  if (typeof rollback1 !== "string") {
    aInstance2.setAllStates(rollback1);
  }
  console.log("1", aInstance2.getAllStates());
  const rollback0 = care.rollbackFromSnapshot(origin2);
  console.log("0", rollback0); // 롤백이 없어, 스트링으로!
}
