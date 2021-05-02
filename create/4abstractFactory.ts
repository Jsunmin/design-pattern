{
  // DP=create/4abstractFactory npm start

  /**
   * 추상팩토리 패턴
   *  팩토리 메서드(객체를 생성하는 클래스의 선언/구현 분리)를 확장
   *  추상팩토리를 통해 여러 그룹군을 만들고 -> 그 그룹군마다 클래스를 생성
   *
   * 팩토리 메서드 패턴은 개수를 떠나, 상위 클래스의 메서드를 통해 인스턴스를 생성했다면,
   *  추상팩토리는 하위 클래스를 구현하고, 이 클래스를 통해 여러 객체를 생성!
   *
   * 은닉성: 상위 클래스로부터 선언받은 메서드에 대해, 각 하위 클래스의 구현부를 외부로부터 숨김 (다른 형제 클래스도 모른다!)
   * 목적성: 해결할 목적을 위해, 하위 클래스가 추가 생성
   *  ~ 이렇게 생성된 자식클래스는, 한 상위 클래스로부터 나오면서 서로 호환성을 가짐
   *
   * -> 추상팩토리는 각 목적에 따라 하위 그룹군 생성해감
   *  어느정도 유사한 틀을 가진 하위 그룹군 생성에는 용이 / 틀이 바뀌는 그룹의 추가는 오히려 유지보수에 복잡..
   * -> 객체의 구현까지, 연관된 프로세스들의 연속 (공정) 으로 파악됨
   */
  type Tire = { size: number; madeBy: string };
  // 최상위 팩토리
  abstract class CarFactory {
    // 파라미터는 하위 클래스에 맡긴다 / 리턴값만 명시해 선언!
    abstract createTire(...args: any[]): Tire;
    abstract createEngine(...args: any[]): { power: number; madeBy: string };
  }
  // 제품관련 팩토리
  class TireProduct {
    static assembleTire(
      size: number,
      madeBy: string,
      additional: { [key: string]: any }
    ) {
      return { size, madeBy, ...additional };
    }
  }

  // 하위 팩토리 그룹1
  class KoreanCarFactory extends CarFactory {
    constructor(private madeBy: string) {
      super();
      console.log(`${this.madeBy}에 설립되었습니다.`);
    }
    // 은닉성과 각 그룹에 부여된 목적성에 맞게 구현!
    createTire(size: number) {
      // 다른 클래스를 통해 구현 (매개만 해준다!) ~ 추가 arg로 커스텀!
      return TireProduct.assembleTire(size, this.madeBy, { spare: 3 });
    }
    createEngine(power: number) {
      // 직접 인스턴스 구현
      return { power, madeBy: this.madeBy };
    }
  }
  // 하위 팩토리 그룹2
  class USACarFactory extends CarFactory {
    constructor(private madeBy: string) {
      super();
      console.log(`${this.madeBy}에 설립되었습니다.`);
    }
    createTire(size: number) {
      return TireProduct.assembleTire(size, this.madeBy, { chain: true });
    }
    createEngine(power: number) {
      return { power, madeBy: this.madeBy };
    }
  }
  const koreaCarFacotry = new KoreanCarFactory("KOREA");
  const usaCarFacotry = new USACarFactory("USA");
  console.log(
    koreaCarFacotry.createEngine(10),
    koreaCarFacotry.createTire(5),
    usaCarFacotry.createEngine(8),
    usaCarFacotry.createTire(2)
  );
}
