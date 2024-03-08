import { memo, useMemo } from 'react'
import {
  getConnectedEdges,
  getOutgoers,
  useEdges,
  useStoreApi,
} from 'reactflow'
import BlockIcon from '../../../../block-icon'
import type {
  Branch,
  Node,
} from '../../../../types'
import Add from './add'
import Item from './item'
import Line from './line'
import { BlockEnum } from '@/app/components/workflow/types'

type NextStepProps = {
  selectedNode: Node
}
const NextStep = ({
  selectedNode,
}: NextStepProps) => {
  const store = useStoreApi()
  const branches = useMemo(() => {
    const nodeData = selectedNode.data

    if (nodeData.type === BlockEnum.IfElse)
      return nodeData._targetBranches

    if (nodeData.type === BlockEnum.QuestionClassifier)
      return (nodeData as any).classes
  }, [selectedNode])
  const edges = useEdges()
  const outgoers = getOutgoers(selectedNode as Node, store.getState().getNodes(), edges)
  const connectedEdges = getConnectedEdges([selectedNode] as Node[], edges).filter(edge => edge.source === selectedNode!.id)

  return (
    <div className='flex py-1'>
      <div className='shrink-0 relative flex items-center justify-center w-9 h-9 bg-white rounded-lg border-[0.5px] border-gray-200 shadow-xs'>
        <BlockIcon
          type={selectedNode!.data.type}
          toolProviderId={selectedNode!.data.provider_id}
        />
      </div>
      <Line linesNumber={branches ? branches.length : 1} />
      <div className='grow'>
        {
          !branches && !!outgoers.length && (
            <Item
              nodeId={outgoers[0].id}
              data={outgoers[0].data}
              sourceHandle='source'
            />
          )
        }
        {
          !branches && !outgoers.length && (
            <Add
              nodeId={selectedNode!.id}
              sourceHandle='source'
            />
          )
        }
        {
          branches?.length && (
            branches.map((branch: Branch) => {
              const connected = connectedEdges.find(edge => edge.sourceHandle === branch.id)
              const target = outgoers.find(outgoer => outgoer.id === connected?.target)

              return (
                <div
                  key={branch.id}
                  className='mb-3 last-of-type:mb-0'
                >
                  {
                    connected && (
                      <Item
                        data={target!.data!}
                        nodeId={target!.id}
                        sourceHandle={branch.id}
                        branchName={branch.name}
                      />
                    )
                  }
                  {
                    !connected && (
                      <Add
                        key={branch.id}
                        nodeId={selectedNode!.id}
                        sourceHandle={branch.id}
                        branchName={branch.name}
                      />
                    )
                  }
                </div>
              )
            })
          )
        }
      </div>
    </div>
  )
}

export default memo(NextStep)
