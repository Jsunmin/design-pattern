{
  // DP=behavior/9templateMethod npm start

  /**
   * 템플릿: 객체지향에서, 공통되는 처리 로직
   *
   * 상속과 오버라이드를 통해 공통되는 처리 로직 처리:
   *  여러 책임을 가지는 객체 중에, 공통되는 처리 로직을 상위 로직으로 분리 ~ 일반화
   *   변화되는 부분은 하위 클래스에 추가 선언 (오버라이드)
   *  상속을 통해 결합되어, 공통된 로직+커스텀 로직 실행!
   *
   * -> 중복된 코드 제거 & 하위 클래스 통해 다양한 동작 분리!
   *
   * 일반 클래스로 일반화를 하면, 오버라이딩으로 하위의 커스텀 로직들을 구현한다. ~ 메서드의 중복들로 자원 낭비..
   *  cf 오버라이딩시 함수 시그니처는 반드시 똑같아야 함! (리스코프 치환 원칙)
   *  cf 오버라이드 방지하는 final 명시자는 ts에서 readonly로!!
   */

  // 클래스만을 통해 일반화 처리
  class Car {
    public name = "보통차";
    constructor() {
      this.name = "보통차";
    }
    make() {
      const tire = this.tire();
      const body = this.body();
      const engine = this.engine();
      console.log(`완성: ${tire} ${body} ${engine}`);
    }

    tire() {
      return "4개 보통 타이어";
    }
    body() {
      return "보통 사이즈 차체";
    }
    engine() {
      return "보통 엔진";
    }
  }

  // 커스텀한 하위 클래스 1차
  class Motorcycle extends Car {
    tire() {
      return "2개 보통 타이어";
    }
    body() {
      return "소형 사이즈 차체";
    }
  }

  class Offroader extends Car {
    public name = "오프로더";
    constructor() {
      super();
    }
    tire() {
      // 상위 클래스의 메서드는 살아있다 ~ 오버라이딩일뿐..
      console.log(" cf) 상위클래스 메서드~", super.tire());
      return "4개 대형 타이어";
    }
    engine() {
      return "대형 엔진";
    }
    // super는 그냥 프로토타입의 값 가져오는 것.
    // 상위 클래스에서 정의한 프로퍼티는 프로토타입에 안들어감; 메서드는 들어가고..
    // 변수는 직접 상위 클래스의 프로토타입에 넣어줘야, super로 접근 가능
    // 다른 언어는 안 이렇겠지??
    getName() {
      console.log(" 상위1:", super.name);
      Car.prototype.name = "뭔데?!";
      console.log(" 상위2:", super.name);
      console.log(" 본체:", this.name);
    }
  }
  // 커스텀한 하위 클래스 2차
  class Scooter extends Motorcycle {
    tire() {
      return "2개 소형 타이어";
    }
    engine() {
      return "소형 엔진";
    }
  }

  console.log("상속을 통한 로직 구현 (오버라이딩)");
  new Car().make();
  new Motorcycle().make();
  new Scooter().make();
  const offroader = new Offroader();
  offroader.make();
  offroader.getName();

  /**
   *  템플릿메서드 패턴
   * 추상화를 통해, 공통로직을 상위 클래스의 메서드로 정의하고, (템플릿 메서드)
   * 이렇게 만든 템플릿 메서드는 추상화로 명시한 메서드를 호출해서 로직 구성
   *
   * 상위 클래스: 템플릿 메서드 정의 / 하위 클래스: 호출되는 로직 메서드 구현
   *
   * -> 상위 클래스가 하위 클래스 구성 요소에 의존 (실제 로직)
   *   중복된 코드 제거 & 하위 클래스 통해 다양한 동작 분리!
   *   로직의 전체 구조는 유지되면서, 일부분만 수정할때 특히 유용!
   *
   * 후크(primitive method): 템플릿 메서드에서 불리는 추상화된 메서드 (하위 클래스에서 구현되는)
   *
   *  일반 상속을 통한 템플릿 메서드와 달리, 함수의 재정의가 아닌 미정의 메서드를 신규 구현!
   * -> 중복된 코드 제거 & 하위 클래스 통해 다양한 동작 분리 & 불필요한 오버라이드 코드 내포X!
   */

  abstract class AbsCar {
    make() {
      const tire = this.tire();
      const body = this.body();
      const engine = this.engine();
      console.log(`완성: ${tire} ${body} ${engine}`);
    }

    abstract tire(): string;
    abstract body(): string;
    abstract engine(): string;
  }

  // 커스텀한 하위 클래스
  class MotorcycleFromAbs extends AbsCar {
    constructor() {
      super();
    }
    // 하위 클래스는 템플릿 메서드에서 호출되는 후크들을 전부 구현해줘야 한다!!
    tire() {
      // console.log(super.tire) 는 undefined!
      // 상위 클래스에는 make만 정의해 실제 로직 집중!
      return "2개 보통 타이어";
    }
    body() {
      return "소형 사이즈 차체";
    }
    engine() {
      return "소형 엔진";
    }
  }
  class OffroaderFromAbs extends AbsCar {
    constructor() {
      super();
    }
    tire() {
      return "4개 대형 타이어";
    }
    body() {
      return "대형 사이즈 차체";
    }
    engine() {
      return "대형 엔진";
    }
  }
  new MotorcycleFromAbs().make();
  new OffroaderFromAbs().make();
}
