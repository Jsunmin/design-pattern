{
  // DP=create/5builder npm start

  /**
   *  복합 객체
   * 둘 이상의 객체(클래스)로부터 의존관계를 갖는 객체(클래스)
   *  ~ 내부에서 객체를 생성&결합 | DI를 통해 받은 객체 결합
   *  -> 디자인패턴에서는 DI를 통한 복합객체의 구성이 권장됨
   *
   * 빌더 패턴: 복잡한 구조의 복합객체를 생성하는 로직을 별도로 분리해 객체를 생성함
   *  복잡한 계층구조 (수직 | 수평적 관계)를 빌더패턴으로 각 구조에 맞게 과정을 분리해 처리
   *  - 빌더는 어떤 객체가 생성되는지 아예 모르고
   *    빌더의 복합객체 생성은 전적으로 알고리즘(DI된 다른 클래스)에 의존
   */

  abstract class AbsBuilder {
    protected algorithm: any;

    setAlgorithm(algorithm: any) {
      console.log("알고리즘 저장");
      this.algorithm = algorithm;
    }
    getInstance() {
      return this.algorithm.getResult();
    }
    abstract build(...args: any[]): any;
  }

  // 빌드 구현을 맡은 로직부분 추상 클래스
  abstract class AbsAlgorithm {
    protected result: any;

    // 복합 클래스의 빌드를 위한 여러 프로세스 구분
    abstract preprocessing(...args: any[]): any;
    abstract processing(...args: any[]): any;
    abstract postprocessing(...args: any[]): any;

    getResult() {
      return this.result;
    }
  }

  // 추상 빌더를 받는 구현 클래스 (객체 생성을 지시 ~ 내부 알고리즘 통해 빌드)
  class Builder extends AbsBuilder {
    constructor(algorithm: any) {
      super();
      // 알고리즘 클래스를 DI로 받아옴
      if (algorithm) {
        this.setAlgorithm(algorithm);
      }
    }

    build(args1: any[], args2: any[], args3: any[]) {
      // 외부에서 받아온 객체를 통해 빌드함
      console.log("빌드 시작");
      this.algorithm.preprocessing(...args1);
      this.algorithm.processing(...args2);
      this.algorithm.postprocessing(...args3);

      return this;
    }
  }

  // 실제 빌드로직 구현 클래스 (실제 객체 생성 로직이 여기에 있음)
  class Algorithm extends AbsAlgorithm {
    constructor() {
      super();
      this.result = {
        name: "object",
      };
    }

    preprocessing(key: string, value: any) {
      this.result[key] = value;
    }
    processing(key: string, value: any) {
      this.result[key] = value;
    }
    postprocessing(key: string, value: any) {
      this.result[key] = value;
    }
  }

  // 실행
  // 빌드로직 관련 객체 생성
  const specificBuildLogic = new Algorithm();
  // 빌드로직을 빌더에 DI
  const specificBuilder = new Builder(specificBuildLogic);
  // 빌더로 클래스 생성
  const buildedClass = specificBuilder.build(
    ["a", "b"],
    ["c", 1],
    ["d", false]
  );
  // 클래스의 인스턴스 받아옴
  console.log(buildedClass.getInstance());
}
