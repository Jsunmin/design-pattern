{
  // DP=create/1factory npm start

  class KMin {
    constructor() {}

    hello() {
      return "안녕하세요!";
    }
  }
  class EMin {
    constructor() {}

    hello() {
      return "hello!";
    }
  }

  /**
   * DI (의존성 주입)
   *  OOP에서는 여러 책임을 가진 객체가 존재하고 이들의 상호작용이 필연적
   *  이 과정에서 객체간의 결합이 발생하는데, 이를 의존성이라 함.
   *
   * DI: 외부에 의해 객체간 결합관계가 발생하는(주입받는) 것
   */
  class People {
    constructor(private korean: any) {
      // 외부에서 받아온 인종 객체를 받아 프로퍼티화
    }

    sayHello() {
      // 외부에서 유입되어 저장된 객체의 메서드를 실행해줌
      console.log(this.korean, "~");
      console.log(this.korean.hello());
    }
  }

  // 외부 객체 주입
  const kPeople = new People(new KMin());
  kPeople.sayHello();

  /**
   *  팩토리 패턴
   * 생성에 관련한 기능을 별도의 클래스로 위임해,
   *  객체 생성 기능의 확장과 수정을 쉽게하기 위한 패턴
   *
   * new 키워드를 통해 직접적인 생성을 하면 강한 의존성이 생김..
   *  생성자를 사용하지 않고, 팩토리 클래스를 호출해 생성
   */

  type PeopleType = "KO" | "EN";
  // 객체의 생성을 다른 클래스(factory)에 위임
  class PeopleFactory {
    constructor() {}

    static getInstance(type: PeopleType) {
      // 외부 클래스를 대신 생성해줌
      // 클래서로 한커플이 더 생기면서, 성능저하 발생..
      // & 다른 객체를 주입하면 유연하게 쓸 수 있음! (동적 객체 관리)
      // & 추후 생성 처리의 수정이 필요하면 Factory만 건들면 된다!
      if (type === "KO") {
        return new KMin();
      } else if (type === "EN") {
        return new EMin();
      }
      throw new Error("Invalid type!");
    }
  }
  console.log(
    "Factory KO Instance's method : ",
    PeopleFactory.getInstance("KO").hello()
  );
  console.log(
    "Factory EN Instance's method : ",
    PeopleFactory.getInstance("EN").hello()
  );
}
