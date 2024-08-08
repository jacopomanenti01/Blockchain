
'use client'

import React, { useEffect, useState } from 'react';

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

  import { ethers, providers, Signer } from 'ethers';
  import {abi as FactoryAbi} from "@/contracts/out/NFTFactory.sol/NFTFactory.json"

  export function NavigationMenuBar() {
    //set state variables
    const [userAddress, setUserAddress] = useState<string>(localStorage.getItem('userAddress') || '');
    const [provider, setProvider] = useState<providers.Web3Provider | null>(null);
    const [signer, setSigner] = useState<Signer | null>(null);
    const [contract, setContract] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(JSON.parse(localStorage.getItem('isAdmin') || 'false'));
    const [isRecord, setIsRecord] = useState<boolean>(JSON.parse(localStorage.getItem('isRecord') || 'false'));

    //set roles
    const DEFAULT_ADMIN_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("DEFAULT_ADMIN_ROLE"));


    useEffect(() => {
      const storedUserAddress = localStorage.getItem('userAddress');
      if (storedUserAddress) {
          setUserAddress(storedUserAddress);
      }

      if (window.ethereum == null) {
          console.log("MetaMask not installed; using read-only defaults");
      } else if (window.ethereum) {
          window.ethereum.on('accountsChanged', (accounts: string[]) => {
              if (accounts.length > 0) {
                  setUserAddress(accounts[0]);
                  localStorage.setItem('userAddress', accounts[0]);
              } else {
                  setUserAddress('');
                  setProvider(null);
                  setSigner(null);
                  setContract(null);
                  setIsAdmin(false);
                  setIsRecord(false);
                  localStorage.removeItem('userAddress');
                  localStorage.removeItem('provider');
                  localStorage.removeItem('signer');
                  localStorage.removeItem('contract');
                  localStorage.removeItem('isAdmin');
                  localStorage.removeItem('isRecord');
              }
          });
      }

      return () => {
          if (window.ethereum) {
              window.ethereum.removeListener('accountsChanged', () => {});
          }
      };
  }, []); 


    useEffect(() => {

        const fetchAddress = async () => {
                if (userAddress.length > 0) {
                    try {
                        const provider = new ethers.providers.Web3Provider(window.ethereum);
                        const signer = provider.getSigner();
                        // const contract = new ethers.Contract("0x995AC5Be6Fff1ffB0707147090642041e06d6928", FactoryAbi, signer);
                        const contract = new ethers.Contract("0x604D03DA814dA89671b91e4a8E9B35064ED4c5B7", FactoryAbi, signer);
                        setProvider(provider);
                        setSigner(signer)
                        setContract(contract);
                        localStorage.setItem('provider', JSON.stringify(provider));
                        localStorage.setItem('signer', JSON.stringify(signer));
                        localStorage.setItem('contract', JSON.stringify(contract));
                        console.log(provider)
                        console.log(signer)
                        console.log(contract);
                    } catch (error) {
                        console.error('Error fetching address:', error);
                    }
                  }
                }
 
        fetchAddress()
          }, [userAddress]);

  
    
          const checkIfAddressIsAdmin = async () => {
            if (!contract) {
                console.error('Contract is null. Cannot check role.');
                return;
            }
    
            try {
                // Fetch the admin role for the specified role
                const adminRole = await contract.getRoleAdmin(DEFAULT_ADMIN_ROLE);
                console.log('Admin Role for MY_ROLE:', adminRole);
    
                // Check if the address has the admin role
                const isAdmin = await contract.hasRole(adminRole, userAddress);
                console.log(`${userAddress} is admin:`, isAdmin);
                setIsAdmin(isAdmin);
                if (!isAdmin){
                  const checkRecord = await contract.associatedNFT(userAddress)
                  console.log(checkRecord)
                  if(checkRecord !="0x0000000000000000000000000000000000000000"){
                  setIsRecord(true)
                  localStorage.setItem('isRecord', JSON.stringify(true));
                }

                }
                localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
            } catch (error) {
                console.error('Error checking admin role:', error);
            }
        };
    
        useEffect(() => {
            if (userAddress && contract) {
                checkIfAddressIsAdmin();
            }
        }, [userAddress, contract]);

  

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
          {isAdmin && (
                    <NavigationMenuItem>
                      <Link href="/whitelist" legacyBehavior passHref>

                        <NavigationMenuLink className="font-medium">
                            Whitelist
                        </NavigationMenuLink>
                        </Link>

                    </NavigationMenuItem>
                )}
            {isRecord && (
                    <NavigationMenuItem>
                      <Link href="/mint" legacyBehavior passHref>

                        <NavigationMenuLink className="font-medium">
                            Create
                        </NavigationMenuLink>
                        </Link>

                    </NavigationMenuItem>
            )}
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