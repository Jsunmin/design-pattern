{
  // DP=behavior/3visitor npm start

  /**
   *  방문자 패턴
   * 공통된 객체의 데이터 구조와 처리를 분리하는 패턴
   *  분산된 여러 객체로부터 동일한 로직 캐치 -> 공통된 처리 로직을 모아 별도 객체로 분리!
   *   ~ 모든 원소에 구현돼야 하는 메서드를 하나의 객체로!
   *
   * 구성
   *  방문을 받아들이는 객체(작업 객체): 데이터를 갖는 원소 객체를 인자로 받아, 공통 로직을 처리해줌
   *   원소 객체에서 정의하지 못한 행동을 이 객체에 정의 & 수행.
   *  원소 객체(데이터 객체): 방문자 객체에 접근해 처리를 수행하는 객체
   *   방문 객체와 상호작용하면서 작업 수행 ~ 행위 은닉X
   *
   * 데이터 객체와 작업 겍체 분리
   *  ~ 공통로직은 방문가능한 객체에서 가져오고 & 방문자 객체에서 커스텀한 로직 추가 수행 가능!
   *  ~ 방문가능 객체에서 데이터 객체를 받는 accept와 방문자 객체에서 공통 로직객체를 받아오는 processing은 서로 양방향 관계!
   *  ~ 데이터의 독립성 유지 ~ in 데이터 객체
   *  ~ 공통 로직 확장 용이 ~ in 작업 객체
   *
   */
  interface Visitable {
    // 데이터 객체(원소객체)를 받아, 공통 로직을 수행하는 메서드
    accept(visitor: any): any;
  }
  interface Visitor {
    // 외부로 떼어낸 행위를 DI로 받아와 수행하는 메서드
    // accept와 상호작용하는 메서드!
    processing(visitable: any): any;
  }

  // 데이터 객체의 공통 로직을 분리해낸 방문자 클래스
  class Signin implements Visitable {
    private date: Date;
    constructor(private service: string, private type: string) {
      this.date = new Date();
    }

    // 데이터 객체를 받는 함수!
    accept(visitorUser: Visitor) {
      console.log(`processing at ${this.date} in ${this.service}`);
      console.log(`${this.type} 적용중입니다..`);
      // 방문하는 데이터 객체에 공통로직을 정의한 자기 자신을 담아서, 메서드 호출!
      return visitorUser.processing(this);
    }

    // 공통 로직1
    checkId(id: string, pw: string) {
      if (id && pw) {
        console.log(`계정정보 체크 완료 : ${id}`);
      } else {
        throw new Error("계정정보 체크 실패");
      }
    }

    // 공통 로직2
    welcomeConsole(name: string) {
      console.log(`${this.service}에 오신걸 환영합니다 ${name} 고객님!`);
    }

    getServiceInfo() {
      return [this.service, this.date];
    }
  }

  // 데이터 객체
  class User implements Visitor {
    private isLogin = false;
    private loginAt: Date;

    constructor(private name: string, private id: string, private pw: string) {}

    // 행위를 처리하는 방문자 객체를 받아 행위 처리후, 내 상태값 업데이트!
    processing(process: any) {
      if (process instanceof Signin) {
        console.log("로그인 작업을 수행중 입니다");
        // 방문자 로직 처리중
        const [serviceName, createdAt] = process.getServiceInfo();
        process.checkId(this.id, this.pw);
        process.welcomeConsole(this.name);

        console.log(`서비스: ${serviceName}, created At ${createdAt}`);
        this.isLogin = true;
        this.loginAt = new Date();
        console.log(`로그인 작업 완료 ${this.loginAt}\n`);
      }
    }

    getIsLogin() {
      return this.isLogin;
    }
  }

  // 실행
  const loginProcess = new Signin("네이버", "STANDARD");
  const user1 = new User("jsm", "ttttjsssm", "1234");
  const user2 = new User("kjw", "rrwwgg123", "4321");
  // 공통 로직을 담은 객체에 데이터 객체 주입해, 기능 수행!
  loginProcess.accept(user1); // 한 번에 accept -> processing이 수행된다!
  console.log(user1.getIsLogin(), "~ 유저1 로그인 체크\n");
  loginProcess.accept(user2);
  console.log(user2.getIsLogin(), "~ 유저2 로그인 체크\n");
}
