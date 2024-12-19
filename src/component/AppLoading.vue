<template>
  <div class="loading-app"><div>Loading...</div></div>
</template>

<style lang="scss" scoped>
  .loading-app {
    background: #fff;
    visibility: visible;
    opacity: 0;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    animation: fadeIn 5s ease-out forwards; //time loading

    & > div {
      font-size: 10px;
      position: relative;
      text-indent: -9999em;
      border: 0.5rem solid #f5f5f5;
      border-left: 0.5rem solid #1873ba;
      transform: translateZ(0);
      border-radius: 50%;
      width: 5rem;
      height: 5rem;
      animation: spinner 1.1s infinite linear;

      /* Animation quay vòng */
      @keyframes spinner {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    }

    /* Animation fade-in */
    @keyframes fadeIn {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  }
</style>
