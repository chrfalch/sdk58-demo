# from expo's bare-expo benchmarking module (mit), apps/bare-expo/modules/benchmarking/ios/
# BenchmarkingModule.podspec at c35f5fe7c8a.
Pod::Spec.new do |s|
  s.name           = 'NativeRace'
  s.version        = '1.0.0'
  s.summary        = 'The same Swift function, written with the module DSL and with @JS'
  s.description    = 'The same Swift function, written with the module DSL and with @JS'
  s.license        = 'MIT'
  s.author         = 'Rami Maalouf'
  s.homepage       = 'https://github.com/rami-maalouf/sdk58-demo'
  s.platforms      = {
    :ios => '16.4',
  }
  s.swift_version  = '5.9'
  s.source         = { git: 'https://github.com/rami-maalouf/sdk58-demo.git' }
  s.static_framework = true

  s.source_files = '**/*.{h,m,mm,swift}'

  s.dependency 'ExpoModulesCore'

  install_modules_dependencies(s)
end
