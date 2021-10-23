{
  // DP=structure/7proxy npm start

  /**
   * 프록시: 대리자를 내세워 처리
   *  하나의 객체를 두개로 나눠 재구성 -> 직접적인 접근을 막고 대리하는 객체를 경유해, 요청이 실객체로 전달됨
   * 
   * 프록시패턴: 객체 접근을 제어하기 위해 중간에 대리자를 위치시키는 패턴
   *  - 클라이언트 -> 대리 객체 -> 실체 객체 : 우회접근을 통해 실체 객체를 실행함 (간접호출)
   *  - 대리객체와 원본객체는 동일한 인터페이스를 가짐 -> 투명성 확보
   * 
   *  - 프록시 인터페이스를 받아, 프록시 객체 생성 ~ 각 메서드는 실체 객체와 1:1 맵핑됨
   *  - 위임을 통해 프록시객체, 실체객체 연결 ~ 프록시 객체는 실체객체를 DI로 받아, 기능을 내재화함
   *    ~ 객체 -> 프록시 객체 메서드 -> 내부의 실체 객체 메서드 실행
   * 
   * 
   * 투명성을 이용해 객체를 분리하여 재위임한다는 특징을 통해,
   *  1. 추가 작업을 중간단계에 삽입하거나. (ex. 로그, 캐싱)
   *  2. 분리된 객체를 동적으로 연결해, 객체의 생성시점을 관리
   *  3. 객체에 대한 세밀한 접근 관리. (ex. argument 관리)
   *  
   * 역할에 따른 사용 사례: 동적 프록시 / 원격 프록시 / 가상 프록시 / 보호 프록시 / 스마트 참조자 ...
   */

  // 기본적인 프록시
  // 프록시와 실체 객체가 공유할 인터페이스
  interface Obj {
    action1(): void;
    action2(): void;
  }
  // 실제 기능을 담당하는 실체객체
  class RealObj implements Obj {
    constructor() {
      console.log('실체 객체가 생성되었습니다.')
    }
    action1() {
      console.log('실제 기능1 동작!')
    };
    action2() {
      console.log('실제 기능2 동작!')
    }
  }
  // 실체객체까지 경유해야만 하는 프록시객체
  class ProxyObj implements Obj {
    private realObj: any;
    constructor(realObj: any) {
      console.log('프록시 객체가 생성되었습니다.')
      // DI를 통해 생성시 실체 객체를 주입 받음
      this.realObj = realObj;
    }
    action1() {
      console.log('프록시 기능1 동작!')
      this.realObj.action1();
    };
    action2() {
      console.log('프록시 기능2 동작!')
      this.realObj.action2();
    }
  }
  console.log('--- 일반 프록시 ---')
  const obj = new ProxyObj( new RealObj() );
  console.log('기본적인 프록시 동작 (클라이언트 -> 프록시객체 -> 실체객체)')
  obj.action1();
  obj.action2();
  console.log('--------------\n\n')


  /**
   * 프록시 핸들러: 투과적 특성(투명성을 통해, 실체 객체와 동일한 동작을 그대로 대신하는 것)을 통해 요청된 행위를 처리하는 것
   *  프록시는 간접화된 실체객체와의 접근 통로를 제공
   *  프록시 객체 또는 실체 객체, 하나에만 메서드가 정의되는 경우가 있음 & 메서드 추가마다 수정하기 까다로움
   *  -> hanlder를 통해 프록시 or 실체 객체에 정의되지 않은 메서드를 잡아낸다! 
   */ 
  class RealObjWithHandler implements Obj {
    constructor() {
      console.log('실체 객체 (ft 핸들러)가 생성되었습니다.')
    }
    action1() {
      console.log('실제 기능1 동작!')
    };
    action2() {
      console.log('실제 기능2 동작!')
    }
  }
  const handler = {
    get: function(target: any, name: string) {
      if (target[name]) {
        // 해당 이름의 메서드가 존재하면, 해당 메서드 전달
        return target[name];
      } else {
        // 해당 이름의 메서드가 없으면, 에러 콘솔을 찍는 함수를 내려줌
        return function () {
          console.log('잘못된 기능 요청!!', name)
        }
      }
    }
  };
  console.log('--- 프록시 with 핸들러 ---')
  // php의 __call 같은 매직메서드가 없어.. -> js에서 제공하는 proxy API의 핸들러 활용!!
  const proxyWithHandler = new Proxy( new RealObjWithHandler(), handler)
  proxyWithHandler.action1()
  proxyWithHandler.action2()
  proxyWithHandler.action3() // 핸들러의 getter에서 받아온 함수를 그대로 실행한다. ~ 받아온게 함수형태가 아니면 () 때문에 에러!!
  console.log('--------------\n\n')


  /**
   * 동적 프록시: 클라이언트는 해당객체가 프록시객체인지 실체객체인지 몰라야 한다. (프록시의 목적: 은닉성) 
   *  생성을 할 때에도 팩토리 패턴을 통해, 프록시 객체를 생성한다.
   *   ~ 클라이언트는 팩토리에 객체 생성만 요청할 뿐, 반환되는 객체의 종류는 알지 못해야 함
   *   ~ 실체객체와 프록시객체의 구분을 위한 메서드 추가 정도 가능 (isProxy)
   */ 
  class ProxyFactory {
    getObject() {
      const realObj = new RealObj();
      return new ProxyObj(realObj);
    }
    getObjectType() {
      console.log('Proxy');
    }
  }
  console.log('--- 동적 프록시 ---')
  const factory = new ProxyFactory();
  const objForClient = factory.getObject();
  objForClient.action1(); // 클라이언트는 받은 객체가 어떤 객체인지 모른다!
  factory.getObjectType(); // 이런 추가 메서드로 어떤 객체를 받았는지 확인
  console.log('--------------\n\n')


  /**
   * 원격 프록시: 주로 데이터 전달의 목적으로 쓰는 프록시 패턴
   *  캐싱처리 
   *  기능위임 & 대리처리 믹스 : a메서드는 동작 위임 & b메서드는 변경된 행위 수행 등의 커스텀
   *  메서드에 추가 기능 덧붙임
   *  ~ 등의 기능 수정 가능
   */ 
   class ReomoteProxyObj implements Obj {
    private realObj: any;
    constructor(realObj: any) {
      console.log('원격 프록시 객체가 생성되었습니다.')
      // DI를 통해 생성시 실체 객체를 주입 받음
      this.realObj = realObj;
    }
    action1() {
      console.log('대체된 프록시 기능1 동작! ~ 실체 객체 기능1 호출X')
      console.log('캐싱된 결과 프록시 선에서 리턴!')
    };
    action2() {
      console.log('프록시 기능2 동작!')
      this.realObj.action2();
    }
  }
  console.log('--- 원격 프록시 ---')
  const obj2 = new ReomoteProxyObj( new RealObj() );
  obj2.action1(); // 기능 대체
  obj2.action2(); // 기능 
  console.log('--------------\n\n')


  /**
   * 가상 프록시: 프로그램 실행 속도 개선을 목적으로 쓰는 프록시 패턴, 이를 통해 무거운 객체 생성을 잠시 유보함. 
   *  시스템 초기화시 필요한 객체를 미리 생성하는 부트스트래핑 과정으로 속도가 느려지기도 하는데.
   *  가상 프록시패턴은 껍데기인 프록시 객체만 빠르게 생성하고. 실체 객체는 실행시에 동적으로 생성해 프록시 객체와 맵핑
   *  -> 초기화시 객체 생성을 임시 처리함으로써 시스템 성능을 최적화함
   *   ( 물론 처음 기능을 시작할 때 조금 지연이 발생하겠지.. )
   */ 
   class VirtualProxyObj implements Obj {
    private realObj: any;
    constructor() {
      // 생성시, 실체 객체 DI 없음!
      console.log('가상 프록시 객체가 생성되었습니다.')
      console.log('시스템 init중.. 실체객체는 모르겠지만..')
    }
    action1() {
      console.log('대체된 프록시 기능1 동작!')
      console.log('프록시 객체에서 기능1 전부 처리!')
    };
    action2() {
      console.log('프록시 기능2 동작!')
      if (!this.realObj) {
        // 실행할때 동적으로 실체 객체를 생성 및 내재화한다!
        this.lazyRealObjCreate()
      }
      this.realObj.action2();
    }
    lazyRealObjCreate() {
      console.log('실체 객체 동적 생성중..')
      this.realObj = new RealObj();
    }
  }
  console.log('--- 가상 프록시 ---')
  const obj3 = new VirtualProxyObj(); // 시스템 init시 프록시 객체(껍데기)만 생성해 더 빠르다!
  obj3.action1();
  obj3.action2(); // 실질적으로 실체객체 건드는 이 통신에서 객체 동적 생성!
  console.log('--------------\n\n')


  /**
   * 보호 프록시: 통제 제어의 목적으로 쓰는 프록시 패턴 - 객체 접근을 제어하기 위함
   *  시스템 초기화시 프록시 객체만 생성 & 실행시 동적 생성을 하는데, 이 때 권한이 부족하면 실체객체 생성 멈춤
   *  -> 권한없는 사용자의 시스템 사용(초기화)시, 자원을 좀 더 효율적으로 실행
   */
  // 권한들
  const Auth1 = '0x01';
  const Auth2 = '0x02';
  class ProxtyWithAuth implements Obj {
    private realObj: any;
    private permitAuth = '0x01';
    private userAuth: string;
    constructor(permit: string) {
      console.log('권한 체크 프록시 객체가 생성되었습니다.')
      console.log('가상 프록시처럼 동적으로 실체객체를 생성합니다..')
      this.userAuth = permit;
    }
    action1() {
      console.log('대체된 프록시 기능1 동작!')
      console.log('프록시 객체에서 기능1 전부 처리!')
    };
    action2() {
      // 권한이 없으면, 객체 생성도 없이 바로 리턴! - 자원 더 아낌!
      if (this.userAuth !== this.permitAuth) {
        console.log('해당 기능을 수행할 기능이 없습니다!')
        return;
      }
      // 통과해야, 동적으로 실체 객체를 생성 및 내재화
      console.log('프록시 기능2 동작!')
      if (!this.realObj) {
        this.lazyRealObjCreate()
      }
      this.realObj.action2();
    }
    lazyRealObjCreate() {
      console.log('실체 객체 동적 생성중..')
      this.realObj = new RealObj();
    }
  }
  console.log('--- 보호 프록시 ---')
  const obj4WithoutAuth = new ProxtyWithAuth(Auth2); // 시스템 init시 프록시 객체(껍데기)만 생성 ( == 가상 프록시 )
  obj4WithoutAuth.action1();
  console.log(' * 권한X 유저가 생성한 객체에서 기능2 호출!')
  obj4WithoutAuth.action2(); // 권한X
  console.log('\n')
  const obj4WithAuth = new ProxtyWithAuth(Auth1);
  obj4WithAuth.action1();
  console.log(' * 권한O 유저가 생성한 객체에서 기능2 호출!')
  obj4WithAuth.action2(); // 권한O
  console.log('--------------\n\n')


  /**
   * 스마트 참조자: 실체 객체 기능 호출할 때 추가 행위를 부여해 호출 ~ 장식자 패턴과 비슷하게 동적으로 객체 확장
   *  - 실체객체에 동작 요청 전후에 프록시 객체에서 추가 기능 처리
   *  - 또는 실체객체에 기능을 수정하는 대신, 프록시 패턴의 추가 기능으로 대신 처리할 수 있음
   */
  class AdditionalActionProxy implements Obj {
    private realObj: any;
    constructor() {
      console.log('추가기능 프록시 객체가 생성되었습니다.')
    }
    action1() {
      console.log('프록시 기능1 동작!')
      if (!this.realObj) {
        this.lazyRealObjCreate()
      }
      this.realObj.action1();
    };
    action2() {
      console.log('프록시 기능2 동작!')
      console.log('프록시에서 추가 기능2를 붙입니다~~')
      if (!this.realObj) {
        this.lazyRealObjCreate()
      }
      this.realObj.action2();
    }
    lazyRealObjCreate() {
      console.log('실체 객체 동적 생성중..')
      this.realObj = new RealObj();
    }
  }
  console.log('--- 기능 추가 프록시 ---')
  const obj5 = new AdditionalActionProxy();
  obj5.action1();
  obj5.action2(); // 프록시 객체에서 기능을 추가했다!
  console.log('--------------\n\n')
}
