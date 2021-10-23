{
  // DP=create/4abstractFactory npm start

  /**
   * 추상팩토리 패턴
   *  팩토리 메서드(객체를 생성하는 클래스의 선언/구현 분리)를 확장
   *  추상팩토리를 통해 여러 그룹군을 만들고 -> 그 그룹군마다 클래스를 생성
   *
   * 팩토리 메서드 패턴은 상위 클래스의 메서드를 통해 하나의 인스턴스를 생성했다면, (상속받은 하위클래스 당 하나의 생성 메서드)
   *  추상팩토리는 하위 클래스를 구현하고, 이 클래스를 통해 여러 객체를 생성! (상속받은 하위클래스가 여러 객체 생성 메서드를 가짐)
   *
   * 은닉성: 상위 클래스로부터 선언받은 메서드에 대해, 각 하위 클래스의 구현부를 외부로부터 숨김 (다른 형제 클래스도 모른다!)
   * 목적성: 해결할 목적을 위해, 하위 클래스가 추가 생성
   *  ~ 이렇게 생성된 자식클래스는, 한 상위 클래스로부터 나오면서 서로 호환성을 가짐
   *
   * -> 추상팩토리는 각 목적에 따라 하위 그룹군 생성해감
   *  어느정도 유사한 틀을 가진 하위 그룹군 생성에는 용이 / 틀이 바뀌는 그룹의 추가는 오히려 유지보수에 복잡..
   * -> 객체의 구현까지, 연관된 프로세스들의 연속 (공정) 으로 파악됨
   * 
   * 사용 사례 : matrix (행과 열에 따른 객체 생성이 필요할 때)
   *  웹에서 다크모드와 라이트 모드에 따라 다른 버튼, 체크박스, 스크롤바를 만드는 경우 (2 * 3 행렬)
   *  ~ 하나의 추상팩토리에서 2 * 3을 고려한 생성 로직을 가져간다!
   */
  
  // 최상위 팩토리
  abstract class WebComponentFactory {
    // 파라미터는 하위 클래스에 맡긴다 / 리턴값만 명시해 선언!
    // 하나의 객체 안에 여러개의 생성 메서드가 담긴다.
    abstract createBtn(...args: any[]): void;
    abstract createScrollbar(...args: any[]): void;
  }
  // 기능 컴포넌트 관련 팩토리 (가로)
  abstract class Button {
    abstract click(): void
  }
  class DarkBtn extends Button {
    click() {
      console.log('dark click')
    }
  }
  class LightBtn extends Button {
    click() {
      console.log('light click')
    }
  }

  abstract class ScrollBar {
    abstract scroll(): void
  }
  class DarkScroll extends ScrollBar {
    scroll() {
      console.log('dark scroll')
    }
  }
  class LightScroll extends ScrollBar {
    scroll() {
      console.log('light scroll')
    }
  }

  // 하위 팩토리 그룹1
  class LightUIFactory extends WebComponentFactory {
    constructor(private type: string) {
      super();
      console.log(`${this.type} 입니다.`);
    }

    // 은닉성과 각 그룹에 부여된 목적성에 맞게 구현!
    createBtn() {
      // 다른 클래스를 통해 구현 (매개만 해준다!)
      return new LightBtn();
    }
    createScrollbar() {
      // 직접 인스턴스 구현
      return new LightScroll();
    }
  }
  
  // 하위 팩토리 그룹2
  class DarkUIFactory extends WebComponentFactory {
    constructor(private type: string) {
      super();
      console.log(`${this.type} 입니다.`);
    }

    // 은닉성과 각 그룹에 부여된 목적성에 맞게 구현!
    createBtn() {
      return new DarkBtn();
    }
    createScrollbar() {
      return new DarkScroll();
    }
  }

  const lightUIFacotry = new LightUIFactory("lightMode");
  const darkUIFacotry = new DarkUIFactory("darkMode");

  // x축 (라이트/다크모드) y축 (버튼,스크롤바..) 을 기준으로 2 by 2 객체 생성하는 팩토리!
  lightUIFacotry.createBtn().click(),
  lightUIFacotry.createScrollbar().scroll(),
  darkUIFacotry.createBtn().click(),
  darkUIFacotry.createScrollbar().scroll()
}
