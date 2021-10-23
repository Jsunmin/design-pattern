{
  // DP=structure/4decorator npm start

  /**
   * 장식자 패턴:
   *  동적으로 객체 기능을 추가하는 패턴 (동적 확장)
   *  상황별로 다른 행위의 동작 클래스를 설계하기 위해, 대상 객체에 동적으로 기능을 위임한다.
   * 
   * cf
   *  OCP(개방-폐쇄원칙): 새로운 기능을 추가할 경우, 확장을 허용하지만 기존 내용은 변경하지 않음.
   *   ~ 새로운 기능 추가시, 변경이 아닌 확장을 통해 처리!
   * 
   * 하나의 객체에 하나의 책임을 갖는 OOP에서 여러 객체로 책임을 분산하고.
   *  이런 다양한 객체들에서 상속으로 정의하기 힘든 관계들을 데코레이터 패턴으로 동적으로 확장시킨다.
   * 
   * 방식:
   *  기본이 되는 객체를 감싸서 새로운 객체로 확장 ~ 새로운 기능 추가해서
   *   객체의 투명성을 위해, 인터페이스는 동일해야 한다!
   *  기본적으로 복합 객체와 위임(DI)를 통해 동적으로 확장한다!
   * 
   * 장식자 패턴으로 붙을 떄는, 여러 추가 기능을 가진 데코레이터가 붙을 수 있다.
   * 
   * 어댑터패턴은 주로 인터페이스의 수정을 위한 랩핑을 / 장식자패턴은 기능을 변경하기 위한 랩핑을
   */

  // 기존에 쓰이고 있는 객체들
  // 추상화 부분 인터페이스
  interface Component {
    getProductName(): string;
    getProductPrice(): number;
  }

  // 인터페이스에 맞춰 여러 구현화된 클래스(객체)들
  class Product1 implements Component {
    getProductName() {
      return 'Keyboard'
    }
    getProductPrice() {
      return 100000;
    }
  }
  class Product2 implements Component {
    getProductName() {
      return 'Monitor'
    }
    getProductPrice() {
      return 80000;
    }
  }

  // 기존 객체를 변경시킬 데코레이터들
  // 추상화 부분 ~ 기존 객체와 동일한 인터페이스를 가져야 한다! -> 투명성!
  abstract class DecoratorForProduct implements Component {
    // 파일 또는 디렉토리 인스턴스들을 담기위한 저장소
    abstract getProductName(): string;
    abstract getProductPrice(): number;
  }
  
  // 구체화된 데코레이터 ~ 기존의 객체를 DI로 받아, 기존 기능에 추가 동작을 덧붙인다.
  class Cox extends DecoratorForProduct {
    baseProduct: any;

    constructor(product: any) {
      super();
      this.baseProduct = product;
    }
    getProductName() {
      return `${ this.baseProduct.getProductName() } - Cox`;
    }
    getProductPrice() {
      const DC = 10;
      return this.baseProduct.getProductPrice() * (1 - DC / 100); 
    }
  }
  class BenQ extends DecoratorForProduct {
    baseProduct: any;

    constructor(product: any) {
      super();
      this.baseProduct = product;
    }
    getProductName() {
      return `${ this.baseProduct.getProductName() } - BenQ`;
    }
    getProductPrice() {
      const premium = 80000;
      return this.baseProduct.getProductPrice() + premium; 
    }
  }

 const cox = new Cox( new Product1() )
 const benq = new BenQ( new Product2() )

 console.log(
   cox.getProductName(),
   cox.getProductPrice(),
   '\n',
   benq.getProductName(),
   benq.getProductPrice(),
 )
}

// 하나의 기능에 더 많은 기능을 추가할 떄 사용!
// decorator의 적용 순서에 따라 결과가 달라지며, 여러번 데코시킴으로써 효과를 몇번 적용시킬수도 있다!
