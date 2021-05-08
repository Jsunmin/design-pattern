{
  // DP=structure/2bridge npm start

  /**
   * 브릿지 패턴
   *  객체의 확장성을 향상하기 위해, 객체 동작을 처리하는 구현부와 추상부를 분리한 패턴
   *  GOF: "브릿지패턴에서 2개의 객체는 추상화를 구현에서 분리하여, 매우 독립적으로 사용할 수 있어야 한다."
   * 
   * 새로운 요청사항으로 유지보수를 하면, 기존 코드의 수정이 필요.
   *  코드 파악이 필요 & 인터페이스 및 동작의 수정 & +a : 연결된 객체 코드 수정.. 필요..
   *
   * 유지보수 by 상속:
   *  객체의 추가 기능 및 기능 변경 등 유지보수를 위한 목적으로 활용하기 좋다!
   *  하위 클래스에서 오버라이딩 함으로써!
   *  그러나 상속을 통한 지속적인 유지보수는 객체를 무겁게 만든다.. + 강력한 결합(종속) 관계..
   * 
   * 유지보수 by 브릿지 패턴:
   *  지속적인 유지보수를 대비해, 미리 객체의 동작 기능을 추상계층과 구현계층으로 분리해 작성
   *   분리된 기능 부분을 브릿지 패턴으로 결합해 동작시킴!
   * 
   *  1. 추가 기능이 새로운 기능인지 | 역할 분담 (비슷한 종류의 다른 객체) 인지 파악
   *  2. 인터페이스를 통해 클래스 계층화 분리 ~ 각각의 기능 클래스 생성 & 동일한 인터페이스 적용
   *   ~ 잘 설계된 계층은 클래스의 동작을 쉽게 이해하고, 동작 수행을 예측하는데 수월하다!
   *  3. 생성된 여러개의 기능 클래스를, 연결해주는 브릿지 역할 클래스에 전달(위임)
   *  4. 브릿지 클래스의 메서드를 호출해 위임된 여러 기능들 호출
   * 
   *
   * 단점: 복잡한 설계..
   */

  // 구현계층 ~ 인터페이스 및 인터페이스 구현한 클래스
  interface Hello {
    greeting(): string
  }
  // 인터페이스 적용한 하위 클래스 ~ 역할 분담에 따라 기능 클래스를 복수개 생성 & 기능은 커스텀해서 구현
  class English implements Hello {
    greeting() {
      return 'hello~';
    }
  }
  class Korea implements Hello {
    greeting() {
      return '안녕하세요~';
    }
  }

  // 추상계층 ~ 구현부를 연결할 수 있는 프로퍼티와 추상 메서드 구현
  abstract class AbsLanguage {
    language: any;
    abstract greeting(): string
  }
  // 구현부 클래스들을 하나로 묶는 복합클래스 ~ 각 구현부를 이어주는 브릿지 역할
  class Language extends AbsLanguage {
    constructor(lang: any) {
      super();
      this.language = lang;
    }
    
    // 브릿지 구현 ~ 분리된 구현부를 이어주기만 하는 함수 (greeting 호출만!)
    greeting() {
      return this.language.greeting();
    }
  }
  // 기능을 Language에 위임했다.
  const languageKo = new Language( new Korea() );
  const languageEn = new Language( new English() );
  // 만약에 일본어 기능이 추가된다면?
  // const languageJa = new Language( new Japanese() ); 로 새로운 기능 위임하겠지?!

  console.log(
    languageKo.greeting(),
    languageEn.greeting(),
    // languageJa.greeting()
  );
}
