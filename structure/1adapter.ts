{
  // DP=structure/1adapter npm start

  /**
   * 시간, 환경의 변화에 따른 오류 코드 | 사용자의 추가 요청 등..
   *  기존 코드의 재사용을 위해서는 항상 유지보수가 필요하다.
   * 
   * 수정하기 까다로운 코드가 존재할 경우, 해당 코드를 감싸는 보정 코드를 통해 유지보수할 수도 있다.
   *  이렇게 보정을 위해 설계된 객체구조를 어댑터 패턴이라고 한다.
   * 
   * 클라이언트 -> 어댑터(보정을 위해 감싼 객체) -> 어댑티(기존 코드)
   *  : 어댑터는 클라이언트와 어댑티의 통신을 위해 인터페이스구조를 변경한다.
   * 
   * 어댑터라는 중개자로 인해, 클라이언트는 변화에 따른 수정 없이 그대로 기능을 사용할 수 있다.
   * 
   * 주로 인터페이스간의 비호환 문제를 풀기 위해 활용된다.
   * 
   * 상속을 통해서 구현할 수도 있고. 객체 의존성을 통해 구현할 수도 있다.
   *  ~ 유연한 확장을 위해 DI를 통해 구현하는 것 추천!
   * 
   * 최종적으로는 어댑터와 어댑티가 함께 구현된 객체를 통해 요청을 처리한다!
   * 
   * 단점: 랩핑으로 인해, 속도는 저하..
   *  그래도 깔끔한 정리가 가능!
   */

  // 기존 코드 (어댑티)
  class Calculator {
    multiple(a: number, b: number) {
      return a * b;
    }
    plus(a: number, b: number) {
      return a + b;
    }
  }

  // 1 상속을 통한 어댑터 패턴 ~ 강력한 의존관계
  class AdaptoredCalculator1 extends Calculator {
    // 기존 메서드를 오버라이딩 한다.
    // 메서드 오버라이딩은 메서드의 기능 수정을 위해서 쓰인다 - 함수의 시그니처 (파라미터, 리턴타입)는 변경 불가능!!
    // multiple(a: string, b: string) { ~ 이렇게 시그니쳐 변경 (number -> string) 불가능하다!
    /*
     * cf 리스코프 치환 원칙: 상속으로 관계된 상위 하위 클래스는 속성 변경없이 서로의 객체 치환이 가능해야 한다. 
     *  OOP solid 원칙 중 하나!
    **/
    multiple(a: string | number, b: string | number) {
      return super.multiple( Number(a), Number(b) );
    }
    plus(a: string | number, b: string | number) {
      return super.plus( Number(a), Number(b) );
    }
  }

  // 2 합성을 통한 어댑터 패턴 ~ 느슨한 의존관계
  interface Adaptor { // 변경된 사용자 요구사항을 반영한 인터페이스
    // 인자가 string으로 온다!
    multiple(a: string, b: string): number
    plus(a: string, b: string): number
  }

  class AdaptoredCalculator2 implements Adaptor {
    // 어댑티 받아와 내재화 (객채 의존성을 통한 확장)
    constructor(private adaptee: any) {
      // this.adaptee = new Calculator();
    }

    multiple(a: string, b: string) {
      // 어댑터가 인자를 받아 프로세싱 후, 어댑티에게 전달!
      return this.adaptee.multiple(Number(a), Number(b));
    }
    plus(a: string, b: string) {
      // 어댑터가 인자를 받아 프로세싱 후, 어댑티에게 전달!
      return this.adaptee.plus(Number(a), Number(b));
    }
  }

  const extendedCalculator = new AdaptoredCalculator1();
  const rappedCalculator = new AdaptoredCalculator2( new Calculator() );
  console.log(
    'modified request for extended adaptor',
    extendedCalculator.multiple('1', '2'),
    extendedCalculator.plus('1', '2')
  )
  console.log(
    'modified request for composited adaptor',
    rappedCalculator.multiple('1', '2'),
    rappedCalculator.plus('1', '2') 
  )
}
