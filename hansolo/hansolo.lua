local Tunnel = module("vrp","lib/Tunnel")
local Proxy = module("vrp","lib/Proxy")
vRP = Proxy.getInterface("vRP")

local isDriving = false
local isUnderwater = false

Citizen.CreateThread(function()
      if Config.UnitOfSpeed == "kmh" then
          SpeedMultiplier = 3.6
      elseif Config.UnitOfSpeed == "mph" then
          SpeedMultiplier = 2.236936
      end
      Wait(100)
end)

Citizen.CreateThread(function()
  while true do
      Wait(100)
      if isDriving and IsPedInAnyVehicle(PlayerPedId(), true) then
          local veh = GetVehiclePedIsUsing(PlayerPedId(), false)
          local speed = math.floor(GetEntitySpeed(veh) * SpeedMultiplier)
          local vehhash = GetEntityModel(veh)
          local maxspeed = GetVehicleModelMaxSpeed(vehhash) * 3.6
          SendNUIMessage({speed = speed, maxspeed = maxspeed})
      end
  end
end)

Citizen.CreateThread(function()
  while true do
      Wait(1000)
      if Config.ShowSpeedo then
          if IsPedInAnyVehicle(PlayerPedId(), false) and
              not IsPedInFlyingVehicle(PlayerPedId()) and
              not IsPedInAnySub(PlayerPedId()) then
              isDriving = true
              SendNUIMessage({showSpeedo = true})
          elseif not IsPedInAnyVehicle(PlayerPedId(), false) then
              isDriving = false
              SendNUIMessage({showSpeedo = false})
          end
      end
  end
end)

-- Map stuff below
local x = -0.025
local y = -0.015
local w = 0.16
local h = 0.22

Citizen.CreateThread(function()
  local minimap = RequestScaleformMovie("minimap")
    SetMinimapComponentPosition('minimap', 'L', 'B', x, y, w, h)
    SetMinimapComponentPosition('minimap_mask', 'L', 'B', x + 0.17, y + 0.9, 0.072, 0.162)
    SetMinimapComponentPosition('minimap_blur', 'L', 'B', -0.045, 0.01, 0.30, 0.27)

    Wait(5000)
    SetRadarBigmapEnabled(true, false)
    Wait(0)
    SetRadarBigmapEnabled(false, false)

    while true do
      Wait(0)
      BeginScaleformMovieMethod(minimap, "SETUP_HEALTH_ARMOUR")
      ScaleformMovieMethodAddParamInt(3)
      EndScaleformMovieMethod()
      BeginScaleformMovieMethod(minimap, 'HIDE_SATNAV')
      EndScaleformMovieMethod()
  end
end)

CreateThread(function()
  while true do
      Wait(2000)
      SetRadarZoom(1150)
      if Config.AlwaysShowRadar == false then
          if IsPedInAnyVehicle(PlayerPedId(-1), false) then
              DisplayRadar(true)
          else
              DisplayRadar(false)
          end
      elseif Config.AlwaysShowRadar == true then
          DisplayRadar(true)
      end
      if Config.ShowStress == false then
          SendNUIMessage({action = "disable_stress"})
      end

      if Config.ShowVoice == false then
          SendNUIMessage({action = "disable_voice"})
      end

      if Config.ShowFuel == true then
          if isDriving and IsPedInAnyVehicle(PlayerPedId(), true) then
              local veh = GetVehiclePedIsUsing(PlayerPedId(), false)
              local fuellevel = GetVehicleFuelLevel(veh)
              SendNUIMessage({
                  action = "update_fuel",
                  fuel = fuellevel,
                  showFuel = true
              })
          end
      elseif Config.ShowFuel == false then
          SendNUIMessage({showFuel = false})
      end
  end
end)

local on_gps = false
RegisterNetEvent("status:gps")
AddEventHandler("status:gps",function(status)
	on_gps = status
end)

RegisterNetEvent("vrp_hud:update")
AddEventHandler("vrp_hud:update", function(rHunger, rThirst, rStress)
hunger, thirst, stress = rHunger, rThirst, rStress
end)

Citizen.CreateThread(function()
	while true do
    local idle = 250
    local x,y,z = table.unpack(GetEntityCoords(PlayerPedId(),false))

    if started then 
      if IsPauseMenuActive() or menu_celular then
        displayValue = false
      else
        displayValue = true
      end
    end

    if IsPedSwimmingUnderWater(PlayerPedId()) then
      isUnderwater = true
      SendNUIMessage({showOxygen = true})
    elseif not IsPedSwimmingUnderWater(PlayerPedId()) then
      isUnderwater = false
      SendNUIMessage({showOxygen = false})
    end

    if IsPedInAnyVehicle(PlayerPedId()) then
      idle = 250
      inCar = true
			pedcar = GetVehiclePedIsIn(PlayerPedId())
      DisplayRadar(true)
    else
			if on_gps then
			  DisplayRadar(true)
      else
        DisplayRadar(false)
      end
			inCar  = false
      speed = nil
      gasolina = nil
      cintoseg = nil
    end
		SendNUIMessage({
      action = "update_hud",
      actionv = "voice_level",
      hp = GetEntityHealth(PlayerPedId())-101,
      armor = GetPedArmour(PlayerPedId()),
      talking = NetworkIsPlayerTalking(PlayerId()),
      oxygen = GetPlayerUnderwaterTimeRemaining(PlayerId()) *10,
      voicelevel = 3,
      show = show,
      incar = inCar,
      thirst = thirst,
      hunger = hunger,
      stress = stress,
		 	display = displayValue
    });
    Citizen.Wait(idle)
	end
end)