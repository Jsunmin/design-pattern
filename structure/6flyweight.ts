{
  // DP=structure/6flyweight npm start

  /**
   * 선언된 클래스를 하나의 객체로 생성하기 위해 인스턴스화 작업이 필요하다.
   *  인스턴스화 작업에서, 클래스에서 선언한 프로퍼티, 메서드들이 구현된 객체가 메모리 자원을 할당받아 생성된다.
   *  보통 new 생성자 키워드로 이를 진행한다.
   * 
   * 클래스 설계시, 단일 객체 단일 책임의 원칙(SRP) 지키고.
   * 각 객체들이 중복되는 기능을 가지면, 이를 또 다른 객체로 빼는 유지보수를 진행한다. ~ 상속|합성으로 기능 받아온다.
   * 
   * 플라이웨이트 패턴
   *  - 객체마다 최대한 적은 메모리를 할당받는(가벼운 무게 = flyweight) 목적
   *  - 중복되는 부분의 제거를 통해 (by. 공유 & 재사용) 자원을 효율적으로 사용하기 위한 패턴
   *  - 공유를 위해, 객체 생성시 싱글톤 & 팩토리 패턴을 활용한다. 
   *   팩토리에 있으면 해당 객체 리턴 | 없으면 생성 & 팩토리에 저장 = 인스턴스풀, 레지스트리패턴
   * 
   * (주의) 공유객체는 참조를 통해 여러 컨텍스트에서 활용되므로, 특정 컨텍스트의 수정이 다른 컨텍스트에서 영향을 미칠 수 있다! ~ 사이드이팩트
   * 
   * 한 번 할당한 자원을 재사용함으로써 메모리를 절약한다!
   */

  // 여러 공유 객체의 기본틀
  abstract class FlyWeightPaymentRequestModule {
    protected storage: {[key:string]: Date} = {};
    protected name: string = 'Payment';

    abstract requestPayment(amount: number): boolean;

    getPaymentServiceName() {
      return this.name;
    };
    setPaymentServiceName(name: string) {
      this.name = name;
    };
    savePaymentLog(paymentId: string) {
      this.storage[paymentId] = new Date();
    };
  }
  // 싱글톤으로 공유될 객체들
  class NicePay extends FlyWeightPaymentRequestModule {
    constructor() {
      super();
      this.setPaymentServiceName('NICE_PAY');
      console.log('나이스페이 모듈 init');
    }
    requestPayment(amount: number) {
      console.log(`결제 요청중.. : ${amount} for ${this.getPaymentServiceName()}`)
      const result = { code: 200, paymentId: `NP${Math.floor(Math.random() * 10000)}` };
      if (result.code === 200) {
        this.savePaymentLog(result.paymentId);
        return true;
      }
      return false;
    }
  }
  class ZeroPay extends FlyWeightPaymentRequestModule {
    constructor() {
      super();
      this.setPaymentServiceName('ZERO_PAY');
      console.log('제로페이 모듈 init');
    }
    requestPayment(amount: number) {
      console.log(`결제 요청중.. : ${amount} for ${this.getPaymentServiceName()}`)
      const result = { code: 200, paymentId: `ZP${Math.floor(Math.random() * 10000)}` };
      if (result.code === 200) {
        this.savePaymentLog(result.paymentId);
        return true;
      }
      return false;
    }
  }
  class UniPay extends FlyWeightPaymentRequestModule {
    constructor() {
      super();
      this.setPaymentServiceName('UNI_PAY');
      console.log('유니페이 모듈 init');
    }
    requestPayment(amount: number) {
      console.log(`결제 요청중.. : ${amount} for ${this.getPaymentServiceName()}`)
      const result = { code: 200, paymentId: `UP${Math.floor(Math.random() * 10000)}` };
      if (result.code === 200) {
        this.savePaymentLog(result.paymentId);
        return true;
      }
      return false;
    }
  }
  // 공유 객체를 생성 및 관리하는 팩토리
  type PaymentService = 'NICE_PAY' | 'ZERO_PAY' | 'UNI_PAY';
  const paymentObjForDynamicCreate = {
    NICE_PAY: NicePay,
    ZERO_PAY: ZeroPay,
    UNI_PAY: UniPay,
  };
  class PayFlyWegihtFactory {
    private instancePool: {[key:string]: any} = {};

    requestPayment(serviceName: PaymentService, amount: number) {
      if (!this.instancePool[serviceName]) {
        const dynamicClass = paymentObjForDynamicCreate[serviceName];
        this.instancePool[serviceName] = new dynamicClass();
      }
      return this.instancePool[serviceName].requestPayment(amount);
    }
  }

  const sharedPayment = new PayFlyWegihtFactory();
  const payActions = [
    { service: 'NICE_PAY', amount: 100 },
    { service: 'ZERO_PAY', amount: 200 },
    { service: 'NICE_PAY', amount: 1100 },
    { service: 'UNI_PAY', amount: 300 },
    { service: 'UNI_PAY', amount: 400 },
    { service: 'NICE_PAY', amount: 500 },
    { service: 'ZERO_PAY', amount: 600 },
    { service: 'NICE_PAY', amount: 1000 },
  ];
  // 최초 init에만 생성해서, factory init pool에 넣는다!
  payActions.forEach((record: {service: PaymentService, amount: number}) => {
    sharedPayment.requestPayment(record.service, record.amount);
  })
}
