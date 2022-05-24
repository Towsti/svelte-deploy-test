<!-- <script>
    import 'tw-elements';
</script>

<div class="flex justify-center">
    <div>
      <div class="dropdown relative">
        <button
          class="
            dropdown-toggle
            px-6
            py-2.5
            bg-blue-600
            text-white
            font-medium
            text-xs
            leading-tight
            uppercase
            rounded
            shadow-md
            hover:bg-blue-700 hover:shadow-lg
            focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
            active:bg-blue-800 active:shadow-lg active:text-white
            transition
            duration-150
            ease-in-out
            flex
            items-center
            whitespace-nowrap
          "
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Dropdown button
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="caret-down"
            class="w-2 ml-2"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
          >
            <path
              fill="currentColor"
              d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"
            ></path>
          </svg>
        </button>
        <ul
          class="
            dropdown-menu
            min-w-max
            absolute
            hidden
            bg-white
            text-base
            z-50
            float-left
            py-2
            list-none
            text-left
            rounded-lg
            shadow-lg
            mt-1
            hidden
            m-0
            bg-clip-padding
            border-none
          "
          aria-labelledby="dropdownMenuButton1"
        >
          <li>
            <a
              class="
                dropdown-item
                text-sm
                py-2
                px-4
                font-normal
                block
                w-full
                whitespace-nowrap
                bg-transparent
                text-gray-700
                hover:bg-gray-100
              "
              href="#"
              >Action</a
            >
          </li>
          <li>
            <a
              class="
                dropdown-item
                text-sm
                py-2
                px-4
                font-normal
                block
                w-full
                whitespace-nowrap
                bg-transparent
                text-gray-700
                hover:bg-gray-100
              "
              href="#"
              >Another action</a
            >
          </li>
          <li>
            <a
              class="
                dropdown-item
                text-sm
                py-2
                px-4
                font-normal
                block
                w-full
                whitespace-nowrap
                bg-transparent
                text-gray-700
                hover:bg-gray-100
              "
              href="#"
              >Something else here</a
            >
          </li>
        </ul>
      </div>
    </div>
  </div> -->



  <!-- <script>
    import { Dropdown } from 'flowbite-svelte';
    let items = [
      {
        href: "/",
        name: "Dashboard",
      },
      {
        href: "/",
        name: "Settings",
      },
      {
        href: "/",
        name: "Sign out",
      },
    ];
  </script>
  
  <Dropdown {items} label="Dropdown button" id="drop1"/>

   -->

<script>
    import 'flowbite';
</script>
   
<button id="dropdownDefault" data-dropdown-toggle="dropdown" class="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-800 rounded-lg text-sm px-4 py-2 text-center inline-flex items-center" type="button">Dropdown button <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button>

<div id="dropdown" class="z-10 hidden divide-y divide-gray-100 rounded shadow w-44 bg-gray-700" style="position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate3d(391.2px, 681.6px, 0px);" data-popper-placement="bottom">
<ul class="py-1 text-sm text-gray-200" aria-labelledby="dropdownDefault">
<li>
<!-- <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a> -->
    <button class="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-2 active:bg-indigo-800 text-sm">hi</button>
</li>
<li>

</li>

</ul>
</div>
