require 'json'
require 'pathname'
require 'fileutils'

path = Pathname.new(ARGV[0])

pois = {}
categories = Hash.new{ |h, k| h[k] = [] }
JSON.parse(File.read(ARGV[0]))['features'].each{ |poi|
  id = poi['properties']['metadata']['id']
  pois[id] = poi
  poi['properties']['metadata']['category_ids'].each{ |category_id|
    categories[category_id] << poi
  }
}

FileUtils.mkdir_p("#{path.dirname}/poi")
pois.each{ |id, poi|
  File.write(
    "#{path.dirname}/poi/#{id}.geojson",
    JSON.pretty_generate(poi, indent: '    ')
  )

  deps_pois = "#{path.dirname}/poi/#{id}/deps_pois.json"
  deps_poi_ids = if File.exist?(deps_pois)
    JSON.parse(File.read(deps_pois), symbolize_names: true)
  else
    []
  end

  route_point_type = "#{path.dirname}/poi/#{id}/route:point:type.geojson"
  deps = if File.exist?(route_point_type)
    JSON.parse(File.read(route_point_type), symbolize_names: true)
  else
    {
      type: 'FeatureCollection',
      features: []
    }
  end

  deps[:features] = [poi] + deps_poi_ids.map{ |id| pois[id] } + deps[:features]

  FileUtils.mkdir_p("#{path.dirname}/poi/#{id}")
  File.write(
    "#{path.dirname}/poi/#{id}/deps.geojson",
    JSON.pretty_generate(deps, indent: '    ')
  )
  File.write(
    "#{path.dirname}/poi/#{id}/deps.json",
    JSON.pretty_generate(deps, indent: '    ')
  )
}

FileUtils.mkdir_p("#{path.dirname}/pois/category")
categories.each{ |id, pois|
  json = {
    type: 'FeatureCollection',
    features: pois
  }
  %w[geojson json].each{ |ext|
    File.write(
      "#{path.dirname}/pois/category/#{id}.#{ext}",
      JSON.pretty_generate(json, indent: '    ')
    )
  }
}
