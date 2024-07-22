
'use client'

import * as React from "react"

import Link from "next/link"

import { cn } from "@/lib/utils"

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu"

  import Logo from "./logo"



  export function NavigationMenuBar() {
    return (
      <NavigationMenu>
       
        <NavigationMenuList
        className="hidden md:flex md:space-x-4">

<NavigationMenuItem>
      <NavigationMenuTrigger>Listing</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
          <li>
            <Link href="/collection" >
              
                <ListItem title="Featured">
                  Invest on the hottest songs/albums.
                </ListItem>
              
            </Link>
          </li>
          <li>
          <Link href="/NFTdetalis" >
            <ListItem title="Learn More">
              Learn how to invest in music and what you are going to buy.
            </ListItem>
          </Link>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Stats</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  
                  <ListItem  title="Rankings">
                      See the rankings for all the available songs/album.
                  </ListItem>
                  <ListItem  title="Activity">
                      See in what other people are investing into up to date.
                  </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink
              className="font-medium"
              >
                Publish
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className="
              font-medium">
                About us
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        
        </NavigationMenuList>
      </NavigationMenu>
    )
  }
   
  const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
  >(({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  })
  ListItem.displayName = "ListItem"