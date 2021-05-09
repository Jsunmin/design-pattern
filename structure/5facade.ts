{
  const crypto = require('crypto')
  // DP=structure/5facade npm start

  /**
   * OOP에서는 서비스가 커질수록 비즈니스를 해결하기 위한 객체들의 결합 관계가 복잡해진다..
   *  문제 해결을 위해 개발되다보면 시스템간 연결성과 종속성이 강해질 확률이 크다 ~ 유지보수에 큰 스트레스..
   *  이를 해결하기 위해, 여러 서브모듈을 직접 호출해 처리하는 게 아닌 새로운 인터페이스 계층을 추가해 시스템간 의존성을 해결한다.
   * 
   * cf. 인터페이스: 기능을 처리하는 함수에 대한 서로 규약된 방식
   * 
   * 파사드 패턴
   *  - 메인 시스템과 각 기능을 담당하는 서브 시스템들의 중간에 위치하는 인터페이스 객체로,
   *   객체간의 결합도를 낮추고 유연하게 관리할 수 있도록 도와주는 패턴
   *  - 복잡한 구조의 서브 시스템을 간단하게 호출할 수 있도록 하는 인터페이스 모음
   *  - 클라이언트는 파사드(중간 인터페이스) 객체를 통해, 서브 시스템의 세부 사항을 알 필요 없이 특정 기능을 활용한다!
   *   ~ 파사드의 인터페이스만 숙지하면 된다!
   *  ex) 여러 라이브러리, AWS sdk, 외부 API 서비스..
   * 
   * cf. 최소 지식 원칙 (데메테르 법칙): 특정 객체를 수정할 때, 연관된 객체들이 최소한의 수정이 일어나도록 설계해야 한다.
   *  -> 상호작용하는 다른 객체의 최소 지식만 적용해, 객체를 설계해야 한다!
   *  4규칙
   *   1. 자기 자신만의 객체 사용
   *   2. 메서드에 전달된 매개변수 사용
   *   3. 메서드에서 생성된 객체 사용
   *   4. 객체에 속하는 메서드 사용
   * 
   * 구조: 여느 서브 시스템(객체)에 접근할 수 있는 싱글톤의 클래스
   *  상위시스템 | 클라이언트 -> 파사드 객체 -> 서브 시스템 ~ 단방향
   * 
   * 장점:
   *  서브시스템 보호: 파사드를 통해 사용돠게끔 하면서, 잘못된 사용 방지
   *  확장성: 파사드 인터페이스를 유지하면서 서브시스템의 수정을 통해 유지보수하면 상위시스템 | 클라이언트는 변화 못느낌 & 안전
   *  결합도 감소: 상위시스템 | 클라이언트와 각 기능을 담당하는 서브시세틈과의 결합도 낮춤
   *  용이성: 특정 객체를 활용하기위한 전처리 작업들을 전부 파사드에 위임!
   *  공개 인터페이스: 파사드만 노출함으로써, 파사드에 정의된 행위만 노출하고, 그 외의 서브시스템 필수 기능들을 은닉할 수 있음
   * 
   * 차이: 어댑터패턴은 단순히 차이점 해결을 위한 인터페이스 제공 | 파사드패턴은 쉬운 접근과 동작 유지보수를 위한 목적으로 인터페이스 제공
   */

  // 최소 지식 원칙 예시 (1~4)
  class RoadCondition {
    isOk() {
      return true;
    }
  }
  class Car {
    private auth = 'abc';
    // DI로 받아오는 내부 객체 -- 1
    constructor(private engine: any) {};

    // 매개변수로 전달된 객체 -- 2
    start(key: any) {
      // 내부에서 생성된 객체 -- 3
      const road = new RoadCondition();
      if ( 
        // 3의 메서드 활용 ~ Good
        road.isOk() 
        // 2의 메서드 활용 ~ Good
        && key.authorize(this.auth)
        // 4의 메서드 활용 ~ Good
        && this.checkCondition()
        ) {
          // 1의 메서드 활용 ~ Good
          this.engine.start();
          return true;
      }
      return false;
    }

    // 객체 내부의 메서드 -- 4
    checkCondition() {
      return true;
    }
  }

  // 파사드 패턴
  // 서브 모듈1
  class ParameterStore {
    private storage: { [key:string]: string } = {};
    getValue(key: string) {
      return this.storage[key] ?? null;
    }
    setValue(key: string, value: any) {
      if (this.storage[key]) {
        throw new Error("Invalid Key");
      }
      this.storage[key] = JSON.stringify(value);
      return 1;
    }
  }
  // 서브 모듈2
  class SecretKey {
    private salt = 'facade';
    hashKey(key: string) {
      const cipher = crypto.createCipher('aes-256-cbc', this.salt);
      let result = cipher.update(key, 'utf8', 'base64');
      result += cipher.final('base64');
      return result;
    }
    parseHashKey(hashKey: string) {
      const decipher = crypto.createDecipher('aes-256-cbc', this.salt);
      let result = decipher.update(hashKey, 'base64', 'utf8');
      result += decipher.final('utf8');
      return result;
    }
  }
  // 서브 모듈3
  class Kms {
    private storage: { [key:string]: string } = {};
    getKey(hashedKey: string) {
      return this.storage[hashedKey] ?? null;
    }
    setKey(hashedKey: string, key: string) {
      if (this.storage[hashedKey]) {
        throw new Error("Invalid Key");
      }
      this.storage[hashedKey] = key;
      return 1;
    }
  }

  // 3개의 서브모듈을 결합한 서비스를 제공하는 파사드 중간 객체
  class Facade {
    constructor( private kms: any, private secretKey: any, private parameterStore: any ) {
      console.log('서비스 인터페이스 생성')
    };

    setEnvSafely(key: string, value: any) {
      const hashedKey = this.secretKey.hashKey(key);
      this.kms.setKey(hashedKey, key);
      this.parameterStore.setValue(key, value);
      return 1;
    }

    getEnvSafely(key: string) {
      const hashedKey = this.secretKey.hashKey(key);
      const rawKey = this.kms.getKey(hashedKey);
      return this.parameterStore.getValue(rawKey);
    }
  }
  
  // 파사드의 싱글톤 생성을 도와주는 팩토리
  class FacadeFactory {
    private facadeInstance: any;
    getFacade() {
      if ( !this.facadeInstance ) {
        this.facadeInstance = new Facade(new Kms(), new SecretKey(), new ParameterStore());
      }
      return this.facadeInstance;
    }
  }

  // 싱글톤으로 facade 객체 생성
  const facadeFactory = new FacadeFactory()
  const facade1 = facadeFactory.getFacade();
  // context1
  const setKey1 = facade1.setEnvSafely('abc', 'def')
  const getKey1 = facade1.getEnvSafely('abc')
  // context2
  const facade2 = facadeFactory.getFacade();
  const getKey2 = facade2.getEnvSafely('abc')
  // 클라이언트는 해당 비즈니스 로직이 어떻게 세부적으로 수정되는지 알 필요없이 사용가능하다!
  console.log(
    setKey1,
    getKey1,
    getKey2,
  )
}
