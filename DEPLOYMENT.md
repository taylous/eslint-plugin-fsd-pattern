# 배포 가이드

이 문서는 `@taylous/eslint-plugin-fsd-pattern`을 npm에 자동으로 배포하는 방법을 설명합니다.

## 사전 준비

### 1. npm Access Token 발급

1. **npm 웹사이트 로그인**
   - https://www.npmjs.com/ 접속
   - 계정으로 로그인

2. **Access Token 생성**
   - 우측 상단 프로필 아이콘 클릭 → **Access Tokens** 선택
   - 또는 직접 접속: https://www.npmjs.com/settings/[your-username]/tokens

3. **Generate New Token 클릭**
   - **Token Type**: `Automation` 선택
     - Automation: CI/CD에서 사용 (권장)
     - Publish: 수동 배포용
   - **Token Name**: 예) `github-actions-eslint-plugin-fsd`
   - **Generate Token** 클릭

4. **Token 복사**
   - ⚠️ **중요**: Token은 한 번만 표시됩니다. 안전한 곳에 저장하세요!
   - 형식: `npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 2. GitHub Secrets 설정

1. **GitHub Repository 설정 이동**
   - https://github.com/taylous/eslint-plugin-fsd-pattern
   - **Settings** 탭 클릭

2. **Secrets 메뉴 접근**
   - 좌측 사이드바에서 **Secrets and variables** → **Actions** 클릭

3. **New repository secret 클릭**

4. **Secret 추가**
   - **Name**: `NPM_TOKEN`
   - **Value**: 위에서 복사한 npm token 붙여넣기
   - **Add secret** 클릭

## 자동 배포 방법

### GitHub Actions를 통한 자동 배포

이 프로젝트는 **tag push** 방식으로 자동 배포됩니다.

#### 배포 프로세스

1. **버전 업데이트**
   ```bash
   # package.json의 version을 업데이트 (예: 0.1.0 → 0.2.0)
   npm version patch  # 0.1.0 → 0.1.1
   # 또는
   npm version minor  # 0.1.0 → 0.2.0
   # 또는
   npm version major  # 0.1.0 → 1.0.0
   ```

2. **Tag 생성 및 Push**
   ```bash
   # npm version 명령어가 자동으로 git tag를 생성합니다
   # tag를 원격 저장소에 push
   git push && git push --tags
   ```

3. **자동 배포 시작**
   - Tag push가 감지되면 GitHub Actions가 자동으로 실행됩니다
   - 테스트 → 빌드 → npm 배포 순서로 진행

4. **배포 확인**
   - GitHub Actions 탭에서 진행 상황 확인
   - 완료 후 https://www.npmjs.com/package/@taylous/eslint-plugin-fsd-pattern 에서 확인

#### 전체 명령어 예시

```bash
# 1. main 브랜치로 이동
git checkout main
git pull origin main

# 2. 버전 업데이트 (package.json, git tag 자동 생성)
npm version patch -m "chore: bump version to %s"

# 3. 변경사항 push (commits + tags)
git push && git push --tags

# 4. GitHub Actions에서 자동 배포 확인
# https://github.com/taylous/eslint-plugin-fsd-pattern/actions
```

## 배포 워크플로우

### `.github/workflows/publish.yml`

```yaml
on:
  push:
    tags:
      - 'v*'  # v1.0.0, v0.2.0 등의 tag push 시 실행
```

**실행 단계:**
1. ✅ 코드 체크아웃
2. ✅ Node.js 18 설치
3. ✅ Dependencies 설치 (`npm ci`)
4. ✅ 테스트 실행 (`npm test`)
5. ✅ 빌드 (`npm run build`)
6. ✅ npm 배포 (`npm publish`)

### `.github/workflows/test.yml`

```yaml
on:
  push:
    branches: [ main, 'claude/**' ]
  pull_request:
    branches: [ main ]
```

**목적:**
- PR이나 main 브랜치 push 시 자동으로 테스트 실행
- Node.js 18, 20 버전에서 테스트

## 버전 관리 전략

### Semantic Versioning (SemVer)

- **MAJOR** (1.0.0): 하위 호환성이 깨지는 변경
  ```bash
  npm version major
  ```

- **MINOR** (0.1.0): 하위 호환성을 유지하는 기능 추가
  ```bash
  npm version minor
  ```

- **PATCH** (0.0.1): 하위 호환성을 유지하는 버그 수정
  ```bash
  npm version patch
  ```

### 버전 업데이트 예시

```bash
# 현재: 0.1.0

# 버그 수정
npm version patch  # → 0.1.1

# 새 기능 추가 (하위 호환)
npm version minor  # → 0.2.0

# 대규모 변경 (하위 호환 X)
npm version major  # → 1.0.0
```

## 수동 배포 (비상시)

만약 GitHub Actions가 실패하거나 수동 배포가 필요한 경우:

```bash
# 1. 로컬에서 빌드 및 테스트
npm ci
npm test
npm run build

# 2. npm 로그인
npm login

# 3. 수동 배포
npm publish --access public
```

## 배포 후 확인사항

### ✅ npm 배포 확인
- https://www.npmjs.com/package/@taylous/eslint-plugin-fsd-pattern
- 버전이 올바르게 업데이트 되었는지 확인

### ✅ 설치 테스트
```bash
# 새 프로젝트에서 설치 테스트
mkdir test-install
cd test-install
npm init -y
npm install --save-dev @taylous/eslint-plugin-fsd-pattern
```

### ✅ GitHub Release 생성 (선택사항)
1. GitHub Repository → **Releases** 탭
2. **Draft a new release** 클릭
3. Tag 선택 및 Release Notes 작성
4. **Publish release** 클릭

## 트러블슈팅

### 문제: GitHub Actions가 npm publish 실패

**원인**: NPM_TOKEN이 올바르게 설정되지 않음

**해결**:
1. GitHub Secrets에서 `NPM_TOKEN` 확인
2. npm token이 만료되지 않았는지 확인
3. token이 `Automation` 타입인지 확인

### 문제: Tag가 이미 존재

**원인**: 같은 버전의 tag가 이미 존재

**해결**:
```bash
# 로컬 tag 삭제
git tag -d v0.1.0

# 원격 tag 삭제 (주의!)
git push origin :refs/tags/v0.1.0

# 새로운 tag 생성
npm version patch
git push && git push --tags
```

### 문제: 테스트 실패로 배포 중단

**원인**: 코드에 문제가 있어 테스트 실패

**해결**:
1. 로컬에서 `npm test` 실행하여 문제 파악
2. 문제 수정 후 다시 커밋
3. 새로운 tag로 재배포

## 참고 자료

- [npm Automation Tokens](https://docs.npmjs.com/creating-and-viewing-access-tokens)
- [GitHub Actions - Publishing to npm](https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages)
- [Semantic Versioning](https://semver.org/)
