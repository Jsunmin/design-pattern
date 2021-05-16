{
  // DP=behavior/5observer npm start

  /**
   *  관찰자 패턴
   * 특정 객체의 상태변화를 인지해, 이에 맞는 기능을 수행하는 패턴
   *  관찰: 옵저버가 객체의 상태값을 직접 관찰하다가 작업을 수행할 수도 있고. (비효율적..)
   *  통보: 값에 변화가 있을 때 이를 옵저버에게 알리고, 옵저버가 값을 받아 수동적으로 작업을 수행할 수도 있다.
   *  ~ 보통 상태값을 가지고 있는 주체객체가 옵저버에게 통보하는 식으로 옵저버 패턴을 구현
   *
   * 구성
   *  통보를 위한 주체
   *   상태를 갖는 주체는 하나 이상의 감시자 객체를 가짐
   *   이러한 객체의 등록, 추가, 삭제 & 감시자 객체와의 관계 등을 관리
   *  처리를 위한 감시자
   *   통보를 수신받아 처리
   *
   * 특징
   *  1.감시자 객체는 실체 객체에 의존적 ~ 주로 DI를 통해 실체객체에 등록됨
   *   실체객체는 여러 감시자 객체를 갖고 있는 느슨한 결합의 복합객체 양상
   *  2.수동적 통보 ~ 단방향, 브로드캐스팅(과 유사)
   *   상태 변화시, 단방향적인 통보가 이뤄짐 (to 감시자 객체s)
   *   단방향성 감시자 패턴 -> 펍섭 패턴 | 리스너 패턴
   *  3.능동적 통보
   *   감시자객체 -> 실체객체 ~ 이를 받은 실체객체는 다른 옵저버에게 이를 통지하기도 함..
   *   상호간 정보교류가 가능함! (호출 무한 순환에 빠지지 않도록 설계 주의!)
   *
   */

  // 상태값을 갖는 주체 객체
  interface ISubect {
    // 옵저버 관련 필수 메서드
    addObserver(obs: Objserver): void; // 등록
    deleteObserver(id: number): void; // 해제
    notiObserver(): void; // 통보
  }
  class Subject implements ISubect {
    private observers: Objserver[] = [];

    addObserver(obs: Objserver) {
      console.log(`옵저버 ${obs.getId()} 등록!`);
      this.observers.push(obs);
    }
    deleteObserver(id: number) {
      const index = this.observers.findIndex(
        (observer) => observer.getId() === id
      );
      console.log(`옵저버 ${id} 제거!`);
      this.observers.splice(index, 1);
    }

    notiObserver() {
      console.log("동기 노티 발생@@");
      this.observers.forEach((observer) => {
        console.log("sync noti...");
        observer.update();
      });
    }
    notiObserverAsync() {
      console.log("비동기 노티 발생##");
      this.observers.forEach((observer) => {
        // check stage에서 수행될 콜백 ~ this 바인딩 추가
        // setImmediate(observer.update.bind(observer));

        // time, poll, check 등의 페이지 사이에서 실행됨
        process.nextTick(function () {
          console.log("async noti...");
          observer.update();
        });
      });
    }
  }

  // 행동을 맡는 옵저버 객체
  abstract class AbsObjserver {
    private id: number;

    setId(id: number) {
      this.id = id;
    }
    getId() {
      return this.id;
    }
    abstract update(): void;
  }
  class Objserver extends AbsObjserver {
    constructor(id: number) {
      super();
      this.setId(id);
      console.log(`옵저버 ${this.getId()} 생성!`);
    }

    update() {
      console.log(`Obs${this.getId()} : 상태변화가 감지되었습니다!`);
    }
  }

  // 실행
  // 실체 객체 생성
  const subject = new Subject();
  // 옵저버 생성 및 등록
  const obs1 = new Objserver(1);
  subject.addObserver(obs1);
  const obs2 = new Objserver(2);
  subject.addObserver(obs2);
  const obs3 = new Objserver(3);
  subject.addObserver(obs3);
  // 노티1 ~ 비동기 콜이라, 호출된 코드 전부 마무리되고 후에 실행됨..
  subject.notiObserverAsync();
  // 옵저버 제거
  subject.deleteObserver(2);
  // 노티2
  subject.notiObserver();
}
