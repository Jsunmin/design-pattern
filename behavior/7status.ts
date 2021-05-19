{
  // DP=behavior/7status npm start

  /**
   *
   * 보통, 상태를 기반으로, 조건문을 통해 동작을 구분해 작동시킨다.
   *  if, switch 같은 조건문은,
   *   새로운 상태에 따라 매번 비교적 까다로운 유지보수가 필요..
   *   코드 가독성 떨어짐..
   *
   *  상태 패턴
   * 객체 형태로 상태를 분리해, 상태에 따라 행위 객체를 변경하면서 행동 위임! ~ 동적 변화
   *  각 조건의 행동을 클래스로 분리화 ~ 캡슐화
   *  상태와 행위를 책임지는 객체만 생성해 코드 유지보수 ~ 확장성
   *
   *  상태 전이: 동작에 따른 상태값의 변화 ~ 내부 행동으로 인한 자동 변화 | 외부 주입으로 인한 수동 변화
   */

  // 가변함수를 통한 상태 ~ 동작 관리
  const foodDeliveryPhaseObj: { [state: string]: Function } = {
    reception() {
      return "reception";
    },
    order() {
      return "order";
    },
    pickup() {
      return "pickup";
    },
    complete() {
      return "complete";
    },
    cancel() {
      return "cancel";
    },
  };
  const getFoodsState1 = "reception";
  const getFoodsState2 = "order";
  // 분기 없이, 바로 상태와 기능을 연결해 씀 ~ 기능및 상태의 추가 = 함수 추가
  console.log(
    foodDeliveryPhaseObj[getFoodsState1](),
    foodDeliveryPhaseObj[getFoodsState2]()
  );

  // 상태패턴
  interface OrderState {
    process(): void;
  }

  // 각 상태에 맞는 행위 객체
  class StateNone implements OrderState {
    process() {
      console.log("음식점 둘러보는중...");
    }
  }
  class StateReception implements OrderState {
    process() {
      console.log("주문 접수중입니다~");
    }
  }
  class StateOrder implements OrderState {
    process() {
      console.log("주문 생성중입니다~");
    }
  }
  class StatePickup implements OrderState {
    process() {
      console.log("픽업 진행중입니다~");
    }
  }
  class StateComplete implements OrderState {
    process() {
      console.log("주문 완료되었니다~");
    }
  }
  class StateCancel implements OrderState {
    process() {
      console.log("취소되었습니다.");
    }
  }

  class FoodDeliveryService {
    private status = 0;
    private phases = [
      "NONE", // 기본 상태값
      "RECEPTION", // 여기서 쭉 상태++ 따라 프로세스 처리
      "ORDER",
      "PICKUP",
      "COMPLETE",
      "CANCEL",
    ] as const;
    private phasesAction: {
      [state in FoodDeliveryService["phases"][number]]?: OrderState;
    } = {};
    constructor(private serviceName: string) {
      console.log(`\n${serviceName} 앱 켰습니다.`);
      // 각 상태에 대한 동작을 담당하는 객체를 내부에서 생성 관리함
      this.phasesAction["NONE"] = new StateNone();
      this.phasesAction["RECEPTION"] = new StateReception();
      this.phasesAction["ORDER"] = new StateOrder();
      this.phasesAction["PICKUP"] = new StatePickup();
      this.phasesAction["COMPLETE"] = new StateComplete();
      this.phasesAction["CANCEL"] = new StateCancel();
    }

    getOrderStatus() {
      console.log(
        `[${this.serviceName}] 내 주문 상태 : ${this.phases[this.status]}`
      );
      return this.phases[this.status];
    }

    processStatus(interruptStatus?: string) {
      if (interruptStatus === "CANCEL") {
        this.status = 5;
      }
      const status = this.phases[this.status];
      this.phasesAction[status]?.process(); // 상태에 맞는 객체를 찾아서, 행동 위임!
      if (this.status <= 3) {
        this.status++; // 상태에 따른 프로세스 처리 후, 상태 전이!
      }
    }
  }

  // 실행
  const coupang = new FoodDeliveryService("꾸팡");
  coupang.getOrderStatus();
  coupang.processStatus(); // [꾸] 아직 보는중
  coupang.getOrderStatus();
  coupang.processStatus(); // [꾸] 접수
  coupang.processStatus(); // [꾸] 주문
  coupang.getOrderStatus(); // [꾸] 주문 다음의 픽업상태로 넘어가있음
  coupang.processStatus("CANCEL"); // [꾸] 취소
  coupang.getOrderStatus();
  coupang.processStatus(); // [꾸] 취소
  coupang.processStatus(); // [꾸] 취소
  coupang.getOrderStatus();

  const baemin = new FoodDeliveryService("빼민");
  baemin.getOrderStatus();
  baemin.processStatus(); // [빼] 아직 보는중
  baemin.processStatus(); // [빼] 접수
  baemin.processStatus(); // [빼] 주문
  baemin.processStatus(); // [빼] 픽업
  baemin.processStatus(); // [빼] 완료
  baemin.processStatus(); // [빼] 완료
  baemin.getOrderStatus();
}
