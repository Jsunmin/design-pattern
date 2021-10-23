{
  // DP=create/6prototype npm start

  /**
   *  프로토타입 패턴
   * new 생성자를 생성하지 않고 객체를 생성하는 방법
   *  -> 기존 객체의 복사 생성
   *
   * 생성자를 통한 객체 생성에는 기본적으로 자원의 소모가 존재..
   *  특히나 특정 프로퍼티만 다르고 다른 메서드 등이 같다면, 자원의 낭비..
   *  -> 공통된 상탯값은 유지하고 필요한 값들만 변경해서 복제본을 활용!
   *
   * 프로토타입: 복제되는 원형
   */

  class DummyMaker {
    name: string;
    age: number;
    constructor(name: string, age: number) {
      this.name = name;
      this.age = age;
    }

    sayMyName() {
      return this.name;
    }
  }
  // 정상적으로 생성자를 통해 생성
  const dummy1 = new DummyMaker("aaa", 1);

  // 단순 복제를 통해 생성한 객체
  const dummy2 = { ...dummy1 };
  dummy2.name = "bbb";
  console.log("dummy1", dummy1, dummy1.sayMyName());
  console.log("dummy2", dummy2); //  dummy2.sayMyName()); 인스턴스의 메서드는 복제X

  // js 프로토타입으로 원본 메서드 또한 맵핑 (참조)
  const dummy3 = Object.assign({}, dummy1);
  Object.setPrototypeOf(dummy3, DummyMaker.prototype);
  console.log("dummy3", dummy3, dummy3.sayMyName());
  // 단일 인스턴스 메서드 오버라이딩
  dummy3.sayMyName = function () {
    return this.age;
  };
  // 타 객체에는 영향 주지 않음
  console.log("dummy1", dummy1, dummy1.sayMyName());
  console.log("dummy3", dummy3, dummy3.sayMyName());

  // js 프로토타입으로 원본 메서드 또한 참조
  const dummy4 = Object.assign({}, dummy1);
  Object.setPrototypeOf(dummy4, DummyMaker.prototype);
  // 클래스의 프로토타입 변경
  DummyMaker.prototype.sayMyName = function () {
    return this.age;
  };
  // 연관된 하위 객체들 전부 값 바뀜 ~ JS는 원본 프로토타입 메서드 참조하는 식으로 클래스&인스턴스 만들어지니까 뭐?!!
  console.log("dummy1", dummy1, dummy1.sayMyName());
  console.log("dummy4", dummy4, dummy4.sayMyName());
}

// 중간단계까지 클래스 (상속)을 통해 프로토타입으로 만들고, 세부사항을 카피(클론)을 통해 만드는 방식