{
  // DP=behavior/1iterator npm start

  /**
   *  반복자 패턴
   * 배열을 통해 복수의 객체를 관리
   *  배열 순회를 통해 복수의 객체중 타겟 객체를 찾아내 다루는 패턴
   *  집합체 (Aggregate, collection): 복수의 객체를 관리하는 복합객체
   *
   *  배열을 내재화하는 집합체로부터 순회 행위를 외부 객체(iterator)로 분리함
   *   분리이유: 다양한 순환 알고리즘 적용(수정) 용이 & 다른 형태의 집합체에 대한 순환기능 공용화 (최소한의 인터페이스만 지켜!)
   *
   * + 객체의 순회를 분리해서 실행 가능 : 특정 컨텍스트에서 일부 순회, 다른 컨텍스트에서 순회 이어서 실행이 가능하다!
   *   for, foreach.. 한번에 1바퀴 순회!
   */

  // 집합체 규정
  interface Aggregate {
    // 순회를 위한 메서드
    iterator(): void;

    // 여러 형태의 집합체의 기본 기능 ~ 순회에 필요한 최소 기능만을 집합체 메서드화!
    getLength(): number;
    getObjById(id: number): ElementObj | undefined;
    getObjByIndex(index: number): ElementObj | undefined;
  }

  // collection
  type ElementObj = {
    id: number;
    [key: string]: any;
  };
  class Collection implements Aggregate {
    private objs: ElementObj[] = [];
    private length = 0;

    getObjById(id: number) {
      return this.objs.find((obj) => obj.id === id);
    }

    getObjByIndex(index: number) {
      return this.objs[index];
    }

    getLast() {
      return this.objs[this.length - 1];
    }

    append(obj: Partial<ElementObj>) {
      this.objs.push({
        ...obj,
        id: this.length,
      });
      this.length++;
    }

    getLength() {
      return this.length;
    }

    // 반복 기능을 담당하는 기능 분리한 객체 ~ 객체 외부에서 호출해 쓸 수 있도록
    iterator() {
      return;
    }
  }

  // 반복자 객체 정의 ~ 다양한 형태의 집합체를 받아 순환 작업 처리
  interface PolyIterator {
    isNext(): boolean;
    next(): any;
    resetIterate(): void;
  }
  class IteratorObj implements PolyIterator {
    private index = 0;
    // 집합체를 받아온다.
    constructor(private aggregate: Aggregate) {}

    isNext() {
      // 반복객체에서 지정한 인덱스가 집합체의 전체길이를 넘을 수 없다!
      if (this.index >= this.aggregate.getLength()) {
        return false;
      } else {
        return true;
      }
    }

    next() {
      // 받아온 집합체에서 인덱스를 활용해 타겟을 가져온다!
      const target = this.aggregate.getObjByIndex(this.index);
      this.index++;
      return target;
    }

    // 순회 정보 리셋!
    resetIterate() {
      console.log("이터레이터 정보 리셋!");
      this.index = 0;
    }
  }

  // 실행
  // 집합체 생성
  const stockCollection = new Collection();
  stockCollection.append({
    name: "SS",
    price: 81,
  });
  stockCollection.append({
    name: "SK",
    price: 313,
  });
  stockCollection.append({
    name: "LG",
    price: 101,
  });
  // 특정 집합체에 대한 순회 제어부를 외부 객체로 분리 ~ iterator
  const stockIterator = new IteratorObj(stockCollection);
  console.log("순회 1");
  if (stockIterator.isNext()) {
    const ele = stockIterator.next();
    console.log(ele);
  }
  console.log("특정 업무 처리~");
  if (stockIterator.isNext()) {
    const ele = stockIterator.next();
    console.log(ele);
  }
  console.log("작업하던 순회정보 받아서 다시 또 특정 업무 처리~");
  // 중간에 이터레이터 리셋!
  stockIterator.resetIterate();

  console.log("순회 2");
  while (stockIterator.isNext()) {
    const ele = stockIterator.next();
    console.log(ele);
  }
}
