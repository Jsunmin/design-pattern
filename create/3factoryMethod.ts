{
  // DP=create/3factoryMethod npm start

  /**
   *  추상화
   * 추상: 중요한 부분만 분리해 이해하기 쉽게 만드는 작업
   *  ~ 우리는 처음부터 세부적인 부분을 하나하나 살펴보진 않는다.
   *  ~ 주요 부분만 요약해 놓아, 동작을 쉽게 이해하도록 함
   *
   * 추상 클래스는 클래스를 위한 일종의 골격.
   *  추상 클래스를 상속받은 하위 클래스를 만들어, 추상 부분을 실제로 구현함
   *  -> 설계와 구현의 분리
   *
   * 인터페이스: 클래스를 설계하는 방법을 규정하는 약속
   *  ~ 하위 클래스의 구현을 강제화
   *
   * 추상클래스(abstract class ~ extends)
   *  - vs 인터페이스(interface ~ implements)
   *    ~ 상속: 상위 클래스 특징을 포함하는 포괄적 승계 (메서드 승계 포함 = 기능의 전달) vs 설계 규약을 지켜야함
   *  - 하위클래스들은 어느정도 공통점을 물려받으면서(상속) 다형성을 유지할수도 있음
   *     추상 클래스에서 선언한 메서드를 하위클래스에서 구현함
   */
  type Sex = "M" | "F";
  interface IPeople {
    name: string;
    sex: Sex;
    hair?: boolean;
    say(something: string): void;
  }
  abstract class AbsPeople {
    abstract name: string;
    age: number;
    say() {
      return "말하는 상속 메서드~~";
    }
    abstract eat(): void;
  }

  // 인터페이스의 규정을 지켜서 설계
  class PeopleFromInterface implements IPeople {
    name: string;
    sex: Sex;
    hair?: boolean;
    anotherOne: string = "tail";
    constructor(name: string, sex: Sex, hair?: boolean) {
      this.name = name;
      this.sex = sex;
      this.hair = hair;
    }

    say(words: string) {
      console.log(words);
    }
  }

  // 추상(상위) 클래스를 상속받아 생성
  class People1FromAbstractClass extends AbsPeople {
    // 추상화로 선언한 것은 반드시 구현해야 함
    name: string; // 추상화 프로퍼티
    anotherOne: string = "arms";
    eat() {
      // 추상화 메서드 오버라이딩 (다형성1)
      return "yummy";
    }
  }
  class People2FromAbstractClass extends AbsPeople {
    // 추상화로 선언한 것은 반드시 구현해야 함
    name: string; // 추상화 프로퍼티
    anotherOne: string = "arms";
    eat() {
      // 추상화 메서드 오버라이딩 (다형성2)
      return "얌얌";
    }
  }
  const people1 = new People1FromAbstractClass();
  const people2 = new People2FromAbstractClass();
  console.log("상속1", people1.eat(), "/", people1.say());
  console.log("상속2", people2.eat(), "/", people2.say());

  /**
   *  팩토리 메서드 패턴
   * 팩토리패턴 + 추상화
   * 단순히 생성을 맡는 다른 클래스를 통해, 생성로직을 분리/캡슐화한 팩토리 메서드와 달리
   *  캡슐화된 객체(상위 클래스)에 하위 클래스를 추가
   *  하위 클래스는 상속을 받아 구현(실체화) ~ (+ 각 클래스에 맞춰 다형성 유지도 가능)
   *  실체회된 클래스의 객체(factory)로 다른 객체 생성
   *
   * 추상화를 통해 선언부와 구현부를 분리한 팩토리 패턴 ~ 객체의 생성과정을 보다 세분화해 관리!
   */

  class MysqlClient {
    constructor(host: string) {
      console.log(`connected mysql.. : ${host}`);
    }
  }
  class MariaClient {
    constructor(host: string) {
      console.log(`connected maria.. : ${host}`);
    }
  }
  class MongoClient {
    constructor(host: string) {
      console.log(`connected mongo.. : ${host}`);
    }
  }
  class RedisClient {
    constructor(host: string) {
      console.log(`connected redis.. : ${host}`);
    }
  }

  // 여러 디비 연결(생성)을 해주는 추상화(상위) 클래스
  abstract class AbsDbFactory {
    // 여기가 팩토리 메서드!!! ~ 생성 메서드는 선언된 하위 클래스 메서드로 실행시킴
    getInstance(type: string, host: string, ...args: any[]) {
      // 어떤 하위 클래스가 들어올지 모르므로, 유연한 파라미터 겟
      // 그러나 필수 값은 필터링할 수 있다!
      if (!host.includes("host")) {
        throw new Error("이상한데??!");
      }
      return this.getCustomInstance(type, host, ...args);
    }
    // 하위 클래스는 이를 커스텀 구체화 시킨다!
    abstract getCustomInstance(...args: any[]): any;
  }

  // 각 db에 따른 하위 클래스들
  // sql / nosql로 팩토리 구분 ~ 팩토리 내 파라미터를 통해 타입별 객체 생성
  class SqlFactoryFromAbs extends AbsDbFactory {
    // 실제 생성 메서드의 구현1
    getCustomInstance(type: string, host: string) {
      console.log("args from sql", arguments);
      if (type === "MYSQL") {
        return new MysqlClient(host);
      } else if (type === "MARIA") {
        return new MariaClient(host);
      }
    }
  }
  class NosqlFactoryFromAbs extends AbsDbFactory {
    // 실제 생성 메서드의 구현2
    getCustomInstance(type: string, host: string) {
      console.log("args from sql", arguments);
      if (type === "MONGO") {
        return new MongoClient(host);
      } else if (type === "REDIS") {
        return new RedisClient(host);
      }
    }
  }
  const [sqlFactory, nosqlFactory] = [
    new SqlFactoryFromAbs(),
    new NosqlFactoryFromAbs(),
  ];
  // 추상화 & 팩토리 패턴으로 생성한 인스턴스들
  const mysqlClient = sqlFactory.getInstance("MYSQL", "mysqlhost", "a");
  const mariaClient = sqlFactory.getInstance("MARIA", "mariahost", true);
  const mongoClient = nosqlFactory.getInstance("MONGO", "mongohost", 13132);
  const redisClient = nosqlFactory.getInstance("REDIS", "redishost", null);
  try {
    const fakeClient = nosqlFactory.getInstance("???", "fakefake", undefined);
  } catch (err) {
    console.log("good~~~ 에러발생! : ", err.message);
  }
}
